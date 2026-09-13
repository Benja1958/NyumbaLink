from fastapi import (
    Depends,
    HTTPException,
    Request,
    status,
)
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.utils.security import decode_access_token


security = HTTPBearer(
    auto_error=False
)


def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(
        security
    ),
    db: Session = Depends(get_db),
):
    token = request.cookies.get(
        "access_token"
    )

    if (
        not token
        and credentials is not None
    ):
        token = credentials.credentials

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    try:
        payload = decode_access_token(
            token
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token",
            )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
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

    return user

def get_current_user_optional(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(
        security
    ),
    db: Session = Depends(get_db),
) -> User | None:
    """Resolve the current user if authenticated, otherwise None.

    Unlike get_current_user, this never raises for a missing or
    invalid token — used by public endpoints that behave
    differently for a logged-in user without requiring login.
    """
    token = request.cookies.get(
        "access_token"
    )

    if (
        not token
        and credentials is not None
    ):
        token = credentials.credentials

    if not token:
        return None

    try:
        payload = decode_access_token(
            token
        )

        user_id = payload.get("sub")

        if user_id is None:
            return None

    except JWTError:
        return None

    return (
        db.query(User)
        .filter(
            User.id == int(user_id)
        )
        .first()
    )


def require_landlord(
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "landlord":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only landlords can perform this action",
        )

    return current_user

def require_tenant(
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "tenant":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only tenants can perform this action",
        )

    return current_user

def require_admin(
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can perform this action",
        )

    return current_user