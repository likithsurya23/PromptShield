from typing import Any, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.config import settings
from app.schemas import TokenResponse, UserLoginRequest, UserRegisterRequest, UserResponse
from app.security.auth import create_access_token, get_current_user
from app.services.user_service import user_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register New User",
    description="Create a new user account for PromptShield dashboard and API access."
)
async def register(request: UserRegisterRequest) -> UserResponse:
    existing_username = await user_service.get_user_by_username(request.username)
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered."
        )

    existing_email = await user_service.get_user_by_email(request.email)
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address already registered."
        )

    user = await user_service.create_user(
        username=request.username,
        email=request.email,
        password=request.password
    )
    return UserResponse(
        id=user.get("id"),
        username=user["username"],
        email=user["email"],
        role=user["role"]
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="User Login (JSON)",
    description="Authenticate with username/email and password to receive a JWT access token."
)
async def login_json(request: UserLoginRequest) -> TokenResponse:
    user = await user_service.authenticate_user(request.username, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(data={"sub": user["username"], "role": user.get("role", "user")})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@router.post(
    "/token",
    response_model=TokenResponse,
    summary="OAuth2 Token Endpoint",
    description="OAuth2-compatible endpoint allowing token generation directly from the Swagger UI Authorize modal."
)
async def login_oauth2(form_data: OAuth2PasswordRequestForm = Depends()) -> TokenResponse:
    user = await user_service.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(data={"sub": user["username"], "role": user.get("role", "user")})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get Current User Profile",
    description="Retrieve the profile of the currently authenticated JWT bearer."
)
async def get_me(current_user: Dict[str, Any] = Depends(get_current_user)) -> UserResponse:
    username = current_user.get("sub")
    user = await user_service.get_user_by_username(username)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    return UserResponse(
        id=user.get("id"),
        username=user["username"],
        email=user["email"],
        role=user.get("role", "user")
    )
