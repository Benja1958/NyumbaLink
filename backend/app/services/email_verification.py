import hashlib
import secrets

from datetime import (
    datetime,
    timedelta,
    timezone,
)


EMAIL_VERIFICATION_EXPIRY_HOURS = 24


def generate_verification_token() -> tuple[str, str]:
    token = secrets.token_urlsafe(32)

    token_hash = hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()

    return token, token_hash


def hash_verification_token(
    token: str,
) -> str:
    return hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()


def get_verification_expiry() -> datetime:
    return (
        datetime.now(timezone.utc)
        + timedelta(
            hours=EMAIL_VERIFICATION_EXPIRY_HOURS
        )
    )