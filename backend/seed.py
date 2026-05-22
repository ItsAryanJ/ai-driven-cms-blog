"""Seed script to populate the database with an admin user."""
import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal
from app.services.auth import AuthService
from app.core.config import settings


def seed():
    db = SessionLocal()
    try:
        admin = AuthService.seed_admin(db, settings.ADMIN_EMAIL, settings.ADMIN_PASSWORD)
        print(f"Admin user ready: {admin.email} (id={admin.id})")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
