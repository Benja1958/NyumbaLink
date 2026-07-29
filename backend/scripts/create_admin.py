from app.config import settings
from app.database import SessionLocal
from app.models.user import User
from app.utils.security import hash_password


def create_admin() -> None:
    db = SessionLocal()

    try:
        existing_user = (
            db.query(User)
            .filter(
                (User.email == settings.ADMIN_EMAIL)
                | (
                    User.phone_number
                    == settings.ADMIN_PHONE_NUMBER
                )
            )
            .first()
        )

        if existing_user:
            print(
                "A user with this email or phone number already exists."
            )
            return

        admin = User(
            full_name=settings.ADMIN_FULL_NAME,
            email=settings.ADMIN_EMAIL,
            phone_number=settings.ADMIN_PHONE_NUMBER,
            password_hash=hash_password(
                settings.ADMIN_PASSWORD
            ),
            role="admin",
        )

        db.add(admin)
        db.commit()
        db.refresh(admin)

        print(
            f"Admin created successfully. ID: {admin.id}"
        )
        print(f"Email: {admin.email}")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    create_admin()