from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.services.auth import AuthService


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    """Extract JWT from HTTP-only cookie and return the current user."""
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    return AuthService.get_current_user(db, token)
