from urllib.parse import quote

import resend

from app.config import settings


resend.api_key = settings.RESEND_API_KEY


def send_verification_email(
    email: str,
    token: str,
) -> None:
    verification_url = (
        f"{settings.FRONTEND_URL}"
        f"/verify-email?token={token}"
        f"&email={quote(email)}"
    )

    resend.Emails.send(
        {
            "from": settings.EMAIL_FROM,
            "to": [email],
            "subject": "Verify your email",
            "html": f"""
                <h2>Verify your email</h2>

                <p>
                    Thanks for creating an account.
                </p>

                <p>
                    Click the link below to verify
                    your email address:
                </p>

                <p>
                    <a href="{verification_url}">
                        Verify email
                    </a>
                </p>

                <p>
                    This link expires in 24 hours.
                </p>
            """,
        }
    )