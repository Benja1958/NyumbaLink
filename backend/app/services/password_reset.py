from datetime import (
    datetime,
    timedelta,
    timezone,
)

from sqlalchemy.orm import Session

from app.models.password_history import (
    PasswordHistory,
)
from app.models.user import User
from app.services.email_verification import (
    generate_verification_token,
    hash_verification_token,
)
from app.utils.security import (
    hash_password,
    verify_password,
)


PASSWORD_RESET_EXPIRY_MINUTES = 60

# Minimum time between reset emails for the same account.
PASSWORD_RESET_COOLDOWN_SECONDS = 60

# Number of previous password hashes kept (in addition to the current one).
PASSWORD_HISTORY_LIMIT = 5


# Reset tokens use the same random-token + SHA-256 scheme as
# email verification tokens.
generate_password_reset_token = (
    generate_verification_token
)
hash_password_reset_token = (
    hash_verification_token
)


def get_password_reset_expiry() -> datetime:
    return (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=PASSWORD_RESET_EXPIRY_MINUTES
        )
    )


def is_password_reused(
    db: Session,
    user: User,
    new_password: str,
) -> bool:
    if verify_password(
        new_password,
        user.password_hash,
    ):
        return True

    previous_hashes = (
        db.query(
            PasswordHistory.password_hash
        )
        .filter(
            PasswordHistory.user_id
            == user.id
        )
        .order_by(PasswordHistory.id.desc())
        .limit(PASSWORD_HISTORY_LIMIT)
        .all()
    )

    return any(
        verify_password(
            new_password,
            row.password_hash,
        )
        for row in previous_hashes
    )


def change_user_password(
    db: Session,
    user: User,
    new_password: str,
) -> None:
    """Archive the current hash, set the new one, and prune history.

    Does not commit; the caller owns the transaction.
    """
    db.add(
        PasswordHistory(
            user_id=user.id,
            password_hash=user.password_hash,
        )
    )

    user.password_hash = hash_password(
        new_password
    )

    db.flush()

    stale_ids = [
        row.id
        for row in (
            db.query(PasswordHistory.id)
            .filter(
                PasswordHistory.user_id
                == user.id
            )
            .order_by(
                PasswordHistory.id.desc()
            )
            .offset(PASSWORD_HISTORY_LIMIT)
            .all()
        )
    ]

    if stale_ids:
        db.query(PasswordHistory).filter(
            PasswordHistory.id.in_(stale_ids)
        ).delete(
            synchronize_session=False
        )
