import secrets

from fastapi import (
    HTTPException,
    Request,
    status,
)


def verify_csrf_token(
    request: Request,
) -> None:
    csrf_cookie = request.cookies.get(
        "csrf_token"
    )

    csrf_header = request.headers.get(
        "X-CSRF-Token"
    )

    if not csrf_cookie or not csrf_header:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="CSRF token missing",
        )

    if not secrets.compare_digest(
        csrf_cookie,
        csrf_header,
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid CSRF token",
        )