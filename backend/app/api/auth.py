from typing import Annotated

from fastapi import APIRouter, Cookie, Response, status

from app.api.deps import CurrentUser
from app.config import settings
from app.db import SessionDep
from app.models import User
from app.schemas.auth import LoginRequest, TokenResponse, UserCreate, UserRead
from app.security import create_access_token
from app.services import auth as service

router = APIRouter(prefix="/auth", tags=["auth"])

REFRESH_COOKIE = "refresh_token"
REFRESH_COOKIE_PATH = "/auth"

RefreshCookie = Annotated[str | None, Cookie(alias=REFRESH_COOKIE)]


def _access_token(user_id: int) -> TokenResponse:
    return TokenResponse(
        access_token=create_access_token(user_id),
        expires_in=settings.access_token_ttl_minutes * 60,
    )


def _set_refresh_cookie(response: Response, token: str, persistent: bool) -> None:
    response.set_cookie(
        REFRESH_COOKIE,
        token,
        max_age=settings.refresh_token_ttl_days * 86400 if persistent else None,
        path=REFRESH_COOKIE_PATH,
        secure=settings.refresh_cookie_secure,
        httponly=True,
        samesite="strict",
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(data: UserCreate, response: Response, session: SessionDep) -> TokenResponse:
    user = await service.register(session, data)
    _set_refresh_cookie(response, await service.open_session(session, user), persistent=True)
    return _access_token(user.id)


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, response: Response, session: SessionDep) -> TokenResponse:
    user = await service.authenticate(session, data.email, data.password)
    _set_refresh_cookie(response, await service.open_session(session, user), data.remember)
    return _access_token(user.id)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(session: SessionDep, refresh_token: RefreshCookie = None) -> TokenResponse:
    return _access_token(await service.refresh(session, refresh_token))


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    response: Response, session: SessionDep, refresh_token: RefreshCookie = None
) -> None:
    await service.revoke(session, refresh_token)
    response.delete_cookie(
        REFRESH_COOKIE,
        path=REFRESH_COOKIE_PATH,
        secure=settings.refresh_cookie_secure,
        httponly=True,
        samesite="strict",
    )


@router.get("/me", response_model=UserRead)
async def me(user: CurrentUser) -> User:
    return user
