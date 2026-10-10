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
            "subject": "Verify your KayaHub email",
            "html": f"""
                <h2>Verify your email</h2>

                <p>
                    Thanks for creating a KayaHub account.
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

                <p>
                    — The KayaHub team
                </p>
            """,
        }
    )


def send_password_reset_email(
    email: str,
    token: str,
    expires_in_minutes: int,
) -> None:
    reset_url = (
        f"{settings.FRONTEND_URL}"
        f"/reset-password?token={quote(token)}"
    )

    resend.Emails.send(
        {
            "from": settings.EMAIL_FROM,
            "to": [email],
            "subject": "Reset your KayaHub password",
            "html": f"""
                <h2>Reset your KayaHub password</h2>

                <p>
                    We received a request to reset the
                    password for your KayaHub account.
                </p>

                <p>
                    <a
                        href="{reset_url}"
                        style="display:inline-block;padding:12px 20px;background:#4f46e5;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;"
                    >
                        Reset password
                    </a>
                </p>

                <p>
                    Or copy this link into your browser:<br>
                    <a href="{reset_url}">{reset_url}</a>
                </p>

                <p>
                    This link expires in {expires_in_minutes}
                    minutes and can only be used once.
                </p>

                <p>
                    If you didn't request a password reset,
                    you can safely ignore this email. Your
                    password won't change.
                </p>

                <p>
                    — The KayaHub team
                </p>
            """,
        }
    )
