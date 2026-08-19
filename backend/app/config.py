from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str

    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Admin provisioning
    ADMIN_EMAIL: str
    ADMIN_PASSWORD: str
    ADMIN_PHONE_NUMBER: str | None = None
    ADMIN_FULL_NAME: str = "NyumbaLink Admin"

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    # Sentry
    SENTRY_DSN: str | None = None
    SENTRY_ENVIRONMENT: str = "development"

    #resend
    RESEND_API_KEY: str
    EMAIL_FROM: str
    FRONTEND_URL: str = "http://localhost:3000"

    class Config:
        env_file = ".env"


settings = Settings()