from datetime import datetime, timezone
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    Response,
    status,
)

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.user import (
    TokenResponse,
    UserCreate,
    UserLogin,
    UserResponse,
    VerifyEmailRequest,
    ResendVerificationRequest,
)

from app.models.email_verification_token import (
    EmailVerificationToken,
)

from app.services.email import (
    send_verification_email,
)

from app.utils.security import (
    create_access_token,
    create_csrf_token,
    create_refresh_token,
    decode_refresh_token,
    hash_password,
    verify_password,
)

from app.services.email_verification import (
    generate_verification_token,
    get_verification_expiry,
    hash_verification_token,
)


router = APIRouter()


@router.post(
    "/signup",
    status_code=status.HTTP_201_CREATED,
    response_model=UserResponse,
)
def signup(
    user_data: UserCreate,
    db: Session = Depends(get_db),
):
    existing_email = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    existing_phone = (
        db.query(User)
        .filter(
            User.phone_number == user_data.phone_number
        )
        .first()
    )

    if existing_phone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number already registered",
        )

    user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        phone_number=user_data.phone_number,
        password_hash=hash_password(
            user_data.password
        ),
        role=user_data.role,
    )

    try:
        db.add(user)

        # Gives us user.id without committing yet
        db.flush()

        token, token_hash = (
            generate_verification_token()
        )

        verification_token = (
            EmailVerificationToken(
                user_id=user.id,
                token_hash=token_hash,
                expires_at=get_verification_expiry(),
            )
        )

        db.add(verification_token)

        # Commit user + verification token together
        db.commit()
        db.refresh(user)

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Email or phone number "
                "already registered"
            ),
        )

    # Send only after successful database commit
    send_verification_email(
        user.email,
        token,
    )

    return user


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    login_data: UserLogin,
    response: Response,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(
            User.email == login_data.email
        )
        .first()
    )

    if (
        not user
        or not verify_password(
            login_data.password,
            user.password_hash,
        )
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Please verify your email "
                "before logging in"
            ),
        )

    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
    }

    access_token = create_access_token(
        data=token_data
    )

    refresh_token = create_refresh_token(
        data=token_data
    )

    csrf_token = create_csrf_token()

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60,
        path="/",
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=7 * 24 * 60 * 60,
        path="/",
    )

    response.set_cookie(
        key="csrf_token",
        value=csrf_token,
        httponly=False,
        secure=False,
        samesite="lax",
        max_age=7 * 24 * 60 * 60,
        path="/",
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: User = Depends(
        get_current_user
    ),
):
    return current_user


@router.post("/refresh")
def refresh_access_token(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    refresh_token = (
        request.cookies.get(
            "refresh_token"
        )
    )

    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token missing",
        )

    try:
        payload = decode_refresh_token(
            refresh_token
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    user = (
        db.query(User)
        .filter(
            User.id == int(user_id)
        )
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    new_access_token = (
        create_access_token(
            data={
                "sub": str(user.id),
                "email": user.email,
                "role": user.role,
            }
        )
    )

    response.set_cookie(
        key="access_token",
        value=new_access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60,
        path="/",
    )

    return {
        "message":
            "Access token refreshed"
    }


@router.post("/logout")
def logout(
    response: Response,
):
    response.delete_cookie(
        key="access_token",
        path="/",
    )

    response.delete_cookie(
        key="refresh_token",
        path="/",
    )

    response.delete_cookie(
        key="csrf_token",
        path="/",
    )

    return {
        "message":
            "Logged out successfully"
    }


@router.post(
    "/email-verification/send"
)
def send_email_verification(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    if current_user.email_verified:
        return {
            "message":
                "Email already verified"
        }

    db.query(
        EmailVerificationToken
    ).filter(
        EmailVerificationToken.user_id
        == current_user.id,
        EmailVerificationToken.used_at.is_(None),
    ).delete(
        synchronize_session=False
    )

    token, token_hash = (
        generate_verification_token()
    )

    verification_token = (
        EmailVerificationToken(
            user_id=current_user.id,
            token_hash=token_hash,
            expires_at=(
                get_verification_expiry()
            ),
        )
    )

    db.add(verification_token)
    db.commit()

    send_verification_email(
        current_user.email,
        token,
    )

    return {
        "message":
            "Verification email sent"
    }


@router.post(
    "/email-verification/verify"
)
def verify_email(
    payload: VerifyEmailRequest,
    db: Session = Depends(get_db),
):
    token_hash = (
        hash_verification_token(
            payload.token
        )
    )

    verification_token = (
        db.query(
            EmailVerificationToken
        )
        .filter(
            EmailVerificationToken.token_hash
            == token_hash
        )
        .first()
    )

    if not verification_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Invalid verification token"
            ),
        )

    if verification_token.used_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Verification token "
                "has already been used"
            ),
        )

    now = datetime.now(
        timezone.utc
    )

    if (
        verification_token.expires_at
        < now
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Verification token "
                "has expired"
            ),
        )

    user = (
        db.query(User)
        .filter(
            User.id
            == verification_token.user_id
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.email_verified = True
    user.email_verified_at = now

    verification_token.used_at = now

    db.commit()

    return {
        "message":
            "Email verified successfully"
    }


@router.post(
    "/email-verification/resend"
)
def resend_email_verification(
    payload: ResendVerificationRequest,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(
            User.email == payload.email
        )
        .first()
    )

    if not user:
        return {
            "message":
                "If an account exists for that email, a verification email has been sent."
        }

    if user.email_verified:
        return {
            "message":
                "If an account exists for that email, a verification email has been sent."
        }

    db.query(
        EmailVerificationToken
    ).filter(
        EmailVerificationToken.user_id
        == user.id,
        EmailVerificationToken.used_at.is_(None),
    ).delete(
        synchronize_session=False
    )

    token, token_hash = (
        generate_verification_token()
    )

    verification_token = (
        EmailVerificationToken(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=(
                get_verification_expiry()
            ),
        )
    )

    db.add(verification_token)
    db.commit()

    send_verification_email(
        user.email,
        token,
    )

    return {
        "message":
            "If an account exists for that email, a verification email has been sent."
    }