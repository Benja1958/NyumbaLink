from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import (
    Base,
    engine,
    ensure_listing_approval_status_column,
)

# Import models so SQLAlchemy registers all tables before create_all()
from app.models import (
    User,
    Listing,
    Favorite,
    Conversation,
    Message,
)

from app.routes import (
    auth,
    listings,
    admin,
    favorites,
    messages,
)


Base.metadata.create_all(bind=engine)
ensure_listing_approval_status_column()


app = FastAPI(
    title="NyumbaLink API",
    description="Backend API for a Kenya-based rental housing platform.",
    version="0.5.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Welcome to the NyumbaLink API"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


app.include_router(
    auth.router,
    prefix="/auth",
    tags=["Auth"],
)

app.include_router(
    listings.router,
    prefix="/listings",
    tags=["Listings"],
)

app.include_router(
    admin.router,
    prefix="/admin",
    tags=["Admin"],
)

app.include_router(
    favorites.router,
    prefix="/favorites",
    tags=["Favorites"],
)

app.include_router(
    messages.router,
    prefix="/messages",
    tags=["Messages"],
)