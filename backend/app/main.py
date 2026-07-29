from fastapi import FastAPI

from app.database import Base, engine, ensure_listing_approval_status_column
from app.models import user, listing, favorite
from app.routes import auth, listings, admin, favorites
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)
ensure_listing_approval_status_column()

app = FastAPI(
    title="NyumbaLink API",
    description="Backend API for a Kenya-based rental housing platform.",
    version="0.4.0",
)

app = FastAPI()

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


app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(listings.router, prefix="/listings", tags=["Listings"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(favorites.router, prefix="/favorites", tags=["Favorites"])
