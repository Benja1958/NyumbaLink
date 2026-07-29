from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import settings


engine = create_engine(settings.DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def ensure_listing_approval_status_column():
    inspector = inspect(engine)

    if "listings" not in inspector.get_table_names():
        return

    columns = {column["name"] for column in inspector.get_columns("listings")}

    if "approval_status" not in columns:
        with engine.begin() as connection:
            connection.execute(
                text(
                    "ALTER TABLE listings ADD COLUMN approval_status VARCHAR NOT NULL DEFAULT 'pending'"
                )
            )

    from app.models.listing import Listing

    db = SessionLocal()
    try:
        listings = db.query(Listing).all()
        for listing in listings:
            listing.approval_status = "approved" if listing.is_approved else "pending"
        db.commit()
    finally:
        db.close()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()