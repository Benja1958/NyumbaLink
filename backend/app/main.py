from fastapi import FastAPI

from app.database import Base, engine
from app.models import user
from app.routes import auth


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NyumbaLink API",
    description="Backend API for a Kenya-based rental housing platform.",
    version="0.4.0",
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