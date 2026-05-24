from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.core.security import verify_password, hash_password, create_access_token, create_refresh_token, decode_token
from app.schemas.auth import LoginRequest, UserResponse


class AuthService:
    @staticmethod
    def authenticate_user(db: Session, login_data: LoginRequest) -> User:
        user = db.query(User).filter(User.email == login_data.email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        if not verify_password(login_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        return user

    @staticmethod
    def create_tokens(user_id: int) -> dict:
        access_token = create_access_token(subject=str(user_id))
        refresh_token = create_refresh_token(subject=str(user_id))
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
        }

    @staticmethod
    def get_current_user(db: Session, token: str) -> User:
        payload = decode_token(token)
        if payload is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )

        token_type = payload.get("type")
        if token_type != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type",
            )

        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )

        user = db.query(User).filter(User.id == int(user_id)).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )
        return user

    @staticmethod
    def refresh_access_token(db: Session, refresh_token_str: str) -> dict:
        payload = decode_token(refresh_token_str)
        if payload is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token",
            )

        token_type = payload.get("type")
        if token_type != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type",
            )

        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )

        user = db.query(User).filter(User.id == int(user_id)).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )

        access_token = create_access_token(subject=str(user.id))
        return {"access_token": access_token}

    @staticmethod
    def seed_admin(db: Session, email: str, password: str) -> User:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            return existing
        admin = User(
            email=email,
            password_hash=hash_password(password),
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        return admin
