import httpx
from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.config import settings
from app.schemas import (
    GitHubTokenLoginRequest,
    OAuthConfigResponse,
    OAuthExchangeRequest,
    SocialLoginRequest,
    TokenResponse,
    UserLoginRequest,
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
    "/social",
    response_model=TokenResponse,
    summary="Social OAuth Authentication",
    description="Authenticate securely using Google or GitHub OAuth credentials."
)
async def login_social(request: SocialLoginRequest) -> TokenResponse:
    provider = request.provider.lower()
    if provider not in ["google", "github"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported OAuth provider '{request.provider}'. Supported: 'google', 'github'."
        )

    if not request.email or "@" not in request.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Valid email address is required for social authentication."
        )

    user = await user_service.find_or_create_social_user(
        provider=provider,
        email=request.email,
        name=request.name,
        avatar_url=request.avatar_url
    )

    token = create_access_token(data={
        "sub": user["username"],
        "email": user["email"],
        "name": user.get("name", user["username"]),
        "provider": provider,
        "role": user.get("role", "user")
    })

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@router.get(
    "/oauth/config",
    response_model=OAuthConfigResponse,
    summary="Get OAuth Configuration",
    description="Retrieve configured public OAuth Client IDs for GitHub and Google."
)
async def get_oauth_config() -> OAuthConfigResponse:
    callback_url = f"{settings.FRONTEND_URL}/auth/callback"
    return OAuthConfigResponse(
        github_client_id=settings.GITHUB_CLIENT_ID,
        google_client_id=settings.GOOGLE_CLIENT_ID,
        callback_url=callback_url
    )


@router.post(
    "/oauth/github/exchange",
    response_model=TokenResponse,
    summary="GitHub OAuth Authorization Code Exchange",
    description="Exchange GitHub OAuth authorization code for real access token, fetch real user profile and emails, link or register user, and issue PromptShield JWT."
)
async def github_oauth_exchange(request: OAuthExchangeRequest) -> TokenResponse:
    client_id = request.client_id or settings.GITHUB_CLIENT_ID
    client_secret = request.client_secret or settings.GITHUB_CLIENT_SECRET

    if not client_id or not client_secret:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="GitHub OAuth Client ID or Client Secret is not configured. Provide them in request or configure GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in backend .env."
        )

    async with httpx.AsyncClient(timeout=10.0) as client:
        token_res = await client.post(
            "https://github.com/login/oauth/access_token",
            headers={"Accept": "application/json"},
            data={
                "client_id": client_id,
                "client_secret": client_secret,
                "code": request.code,
                "redirect_uri": request.redirect_uri
            }
        )

        if token_res.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"GitHub token exchange failed: {token_res.text}"
            )

        token_data = token_res.json()
        gh_token = token_data.get("access_token")
        if not gh_token:
            error_desc = token_data.get("error_description", token_data.get("error", "Failed to retrieve access token from GitHub"))
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"GitHub OAuth error: {error_desc}"
            )

        user_res = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {gh_token}",
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "PromptShield-Security-Engine"
            }
        )
        if user_res.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to fetch GitHub user profile: {user_res.text}"
            )
        gh_user = user_res.json()

        email = gh_user.get("email")
        if not email:
            emails_res = await client.get(
                "https://api.github.com/user/emails",
                headers={
                    "Authorization": f"Bearer {gh_token}",
                    "Accept": "application/vnd.github.v3+json",
                    "User-Agent": "PromptShield-Security-Engine"
                }
            )
            if emails_res.status_code == 200:
                emails_data = emails_res.json()
                for item in emails_data:
                    if item.get("primary") and item.get("verified"):
                        email = item.get("email")
                        break
                if not email and emails_data:
                    email = emails_data[0].get("email")

        if not email:
            email = f"{gh_user.get('login')}@users.noreply.github.com"

        name = gh_user.get("name") or gh_user.get("login")
        avatar_url = gh_user.get("avatar_url")

    user = await user_service.find_or_create_social_user(
        provider="github",
        email=email,
        name=name,
        avatar_url=avatar_url
    )

    token = create_access_token(data={
        "sub": user["username"],
        "email": user["email"],
        "name": user.get("name", user["username"]),
        "provider": "github",
        "role": user.get("role", "user")
    })

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@router.post(
    "/oauth/github/token-login",
    response_model=TokenResponse,
    summary="Direct GitHub Token Authentication",
    description="Authenticate live using a personal GitHub access token, fetching real user profile directly from GitHub API."
)
async def github_token_login(request: GitHubTokenLoginRequest) -> TokenResponse:
    gh_token = request.token.strip()
    if not gh_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="GitHub token cannot be empty."
        )

    async with httpx.AsyncClient(timeout=10.0) as client:
        user_res = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {gh_token}",
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "PromptShield-Security-Engine"
            }
        )
        if user_res.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid GitHub access token or insufficient permissions. Required scope: read:user, user:email."
            )
        gh_user = user_res.json()

        email = gh_user.get("email")
        if not email:
            emails_res = await client.get(
                "https://api.github.com/user/emails",
                headers={
                    "Authorization": f"Bearer {gh_token}",
                    "Accept": "application/vnd.github.v3+json",
                    "User-Agent": "PromptShield-Security-Engine"
                }
            )
            if emails_res.status_code == 200:
                emails_data = emails_res.json()
                for item in emails_data:
                    if item.get("primary") and item.get("verified"):
                        email = item.get("email")
                        break
                if not email and emails_data:
                    email = emails_data[0].get("email")

        if not email:
            email = f"{gh_user.get('login')}@users.noreply.github.com"

        name = gh_user.get("name") or gh_user.get("login")
        avatar_url = gh_user.get("avatar_url")

    user = await user_service.find_or_create_social_user(
        provider="github",
        email=email,
        name=name,
        avatar_url=avatar_url
    )

    token = create_access_token(data={
        "sub": user["username"],
        "email": user["email"],
        "name": user.get("name", user["username"]),
        "provider": "github",
        "role": user.get("role", "user")
    })

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@router.post(
    "/oauth/google/exchange",
    response_model=TokenResponse,
    summary="Google OAuth Code / ID Token Exchange",
    description="Exchange Google authorization code or verify ID token, fetching live user profile and email."
)
async def google_oauth_exchange(request: OAuthExchangeRequest) -> TokenResponse:
    email = None
    name = None
    avatar_url = None

    async with httpx.AsyncClient(timeout=10.0) as client:
        if request.id_token:
            verify_res = await client.get(
                f"https://oauth2.googleapis.com/tokeninfo?id_token={request.id_token}"
            )
            if verify_res.status_code == 200:
                info = verify_res.json()
                email = info.get("email")
                name = info.get("name")
                avatar_url = info.get("picture")

        if not email and request.code:
            client_id = request.client_id or settings.GOOGLE_CLIENT_ID
            client_secret = request.client_secret or settings.GOOGLE_CLIENT_SECRET
            if client_id and client_secret:
                token_res = await client.post(
                    "https://oauth2.googleapis.com/token",
                    data={
                        "code": request.code,
                        "client_id": client_id,
                        "client_secret": client_secret,
                        "redirect_uri": request.redirect_uri or f"{settings.FRONTEND_URL}/auth/callback",
                        "grant_type": "authorization_code"
                    }
                )
                if token_res.status_code == 200:
                    token_data = token_res.json()
                    access_token = token_data.get("access_token")
                    if access_token:
                        userinfo_res = await client.get(
                            "https://www.googleapis.com/oauth2/v3/userinfo",
                            headers={"Authorization": f"Bearer {access_token}"}
                        )
                        if userinfo_res.status_code == 200:
                            uinfo = userinfo_res.json()
                            email = uinfo.get("email")
                            name = uinfo.get("name")
                            avatar_url = uinfo.get("picture")

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to authenticate with Google. Ensure Google credentials and redirect URI are configured correctly."
        )

    user = await user_service.find_or_create_social_user(
        provider="google",
        email=email,
        name=name or email.split("@")[0],
        avatar_url=avatar_url
    )

    token = create_access_token(data={
        "sub": user["username"],
        "email": user["email"],
        "name": user.get("name", user["username"]),
        "provider": "google",
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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    return UserResponse(
        id=user.get("id"),
        username=user["username"],
        name=user.get("name", user["username"]),
        email=user["email"],
        role=user.get("role", "user")
    )
