from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.config import settings
from app.schemas import (
    TokenResponse,
    UserLoginRequest,
    UserPasswordUpdateRequest,
    UserProfileUpdateRequest,
    UserRegisterRequest,
    UserResponse,
)
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
    display_name = (request.name or "").strip()
    username = request.username or (display_name.lower().replace(" ", "_") if display_name else request.email.split("@")[0])

    existing_username = await user_service.get_user_by_username(username)
    if existing_username:
        if request.username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered."
            )
        import secrets
        username = f"{username}_{secrets.token_hex(2)}"

    existing_email = await user_service.get_user_by_email(request.email)
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address already registered."
        )

    user = await user_service.create_user(
        username=username,
        email=request.email,
        password=request.password,
        name=display_name or username
    )
    return UserResponse(
        id=user.get("id"),
        username=user["username"],
        name=user.get("name", user["username"]),
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

    token = create_access_token(data={
        "sub": user["username"],
        "name": user.get("name", user["username"]),
        "email": user["email"],
        "role": user.get("role", "user")
    })
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
        user = await user_service.get_user_by_email(username)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    return UserResponse(
        id=user.get("id"),
        username=user["username"],
        name=user.get("name", user["username"]),
        email=user["email"],
        role=user.get("role", "user")
    )


@router.put(
    "/me/profile",
    response_model=Dict[str, Any],
    summary="Update Current User Profile",
    description="Update username, display name, and email address in the database, returning updated token and profile."
)
async def update_profile(
    request: UserProfileUpdateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    username = current_user.get("sub")
    try:
        updated_user = await user_service.update_user_profile(
            current_identifier=username,
            new_username=request.username,
            name=request.name,
            email=request.email
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    # Generate refreshed JWT with new username & email
    new_token = create_access_token(data={
        "sub": updated_user["username"],
        "name": updated_user.get("name", updated_user["username"]),
        "email": updated_user["email"],
        "role": updated_user.get("role", "user")
    })

    return {
        "success": True,
        "message": "Profile updated successfully.",
        "access_token": new_token,
        "user": {
            "id": updated_user.get("id"),
            "username": updated_user["username"],
            "name": updated_user.get("name", updated_user["username"]),
            "email": updated_user["email"],
            "role": updated_user.get("role", "user")
        }
    }


@router.put(
    "/me/password",
    status_code=status.HTTP_200_OK,
    summary="Update Current User Password",
    description="Verify current password and update to new password in the database."
)
async def update_password(
    request: UserPasswordUpdateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    username = current_user.get("sub")
    try:
        await user_service.update_user_password(
            username_or_email=username,
            current_password=request.current_password,
            new_password=request.new_password
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    return {
        "success": True,
        "message": "Password changed successfully in database."
    }


@router.delete(
    "/me",
    status_code=status.HTTP_200_OK,
    summary="Delete Current User Account",
    description="Permanently delete the authenticated user account and all associated telemetry/scans from the database."
)
async def delete_me(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    username = current_user.get("sub")
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required to delete account."
        )

    user = await user_service.get_user_by_username(username)
    if not user:
        # Check by email
        user = await user_service.get_user_by_email(username)

    if not user:
        # Fallback to cleaning up by subject identifier directly
        await user_service.delete_user(username)
        return {
            "success": True,
            "message": f"Account '{username}' and all associated records have been permanently deleted."
        }

    await user_service.delete_user(user.get("username", username))
    return {
        "success": True,
        "message": f"User account '{user.get('username')}' and all associated scan history, credentials, and telemetry have been permanently deleted from the database."
    }

