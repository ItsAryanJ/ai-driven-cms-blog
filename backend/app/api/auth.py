from fastapi import APIRouter, Depends, Response, Request
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.deps import get_current_user
from app.schemas.auth import LoginRequest, UserResponse
from app.services.auth import AuthService
from app.models.user import User
from app.middleware.rate_limit import limiter

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=UserResponse)
@limiter.limit("10/minute")
def login(request: Request, login_data: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = AuthService.authenticate_user(db, login_data)
    tokens = AuthService.create_tokens(user.id)

    response.set_cookie(
        key="access_token",
        value=tokens["access_token"],
        httponly=True,
        secure=False,  # Set True in production with HTTPS
        samesite="lax",
        max_age=1800,  # 30 minutes
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=tokens["refresh_token"],
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=604800,  # 7 days
        path="/",
    )

    return user


@router.post("/logout")
def logout(response: Response, current_user: User = Depends(get_current_user)):
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/")
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/refresh", response_model=UserResponse)
def refresh_token(request: Request, response: Response, db: Session = Depends(get_db)):
    refresh_token_str = request.cookies.get("refresh_token")
    if not refresh_token_str:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No refresh token provided",
        )

    result = AuthService.refresh_access_token(db, refresh_token_str)

    response.set_cookie(
        key="access_token",
        value=result["access_token"],
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=1800,
        path="/",
    )

    # Return the current user
    user = AuthService.get_current_user(db, result["access_token"])
    return user
