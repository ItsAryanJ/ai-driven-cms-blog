from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from contextlib import asynccontextmanager

from app.core.config import settings
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.middleware.rate_limit import limiter
from app.api.auth import router as auth_router
from app.api.posts import router as posts_router
from app.api.categories import router as categories_router
from app.api.tags import router as tags_router
from app.api.search import router as search_router
from app.api.admin import router as admin_router
from app.services.auth import AuthService

# Import all models so they're registered with Base.metadata
from app.models import User, Post, Category, Tag, post_tags  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: seed admin user
    db = SessionLocal()
    try:
        AuthService.seed_admin(db, settings.ADMIN_EMAIL, settings.ADMIN_PASSWORD)
    finally:
        db.close()
    yield


app = FastAPI(
    title="AI-Driven Blog CMS API",
    description="REST API for a self-hosted single-tenant Blog/CMS",
    version="1.0.0",
    lifespan=lifespan,
)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers under /api prefix
app.include_router(auth_router, prefix="/api")
app.include_router(posts_router, prefix="/api")
app.include_router(categories_router, prefix="/api")
app.include_router(tags_router, prefix="/api")
app.include_router(search_router, prefix="/api")
app.include_router(admin_router, prefix="/api")


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "version": "1.0.0"}
