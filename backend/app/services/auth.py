import datetime as dt

from sqlalchemy import exists, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.errors import ConflictError, UnauthorizedError
from app.models import RefreshSession, User
from app.schemas.auth import UserCreate
from app.security import hash_password, hash_refresh_token, new_refresh_token, verify_password


async def register(session: AsyncSession, data: UserCreate) -> User:
    if await session.scalar(select(exists().where(User.email == data.email))):
        raise ConflictError(f"User with email '{data.email}' already exists")
    user = User(email=data.email, name=data.name, password_hash=hash_password(data.password))
    session.add(user)
    await session.flush()
    return user


async def authenticate(session: AsyncSession, email: str, password: str) -> User:
    user = await session.scalar(select(User).where(User.email == email))
    password_ok = verify_password(password, user.password_hash if user else None)
    if user is None or not password_ok:
        raise UnauthorizedError("Invalid email or password")
    return user


async def open_session(session: AsyncSession, user: User) -> str:
    token = new_refresh_token()
    session.add(
        RefreshSession(
            user_id=user.id,
            token_hash=hash_refresh_token(token),
            expires_at=dt.datetime.now(dt.UTC) + dt.timedelta(days=settings.refresh_token_ttl_days),
        )
    )
    await session.commit()
    return token


async def _find_session(session: AsyncSession, token: str) -> RefreshSession | None:
    stmt = select(RefreshSession).where(RefreshSession.token_hash == hash_refresh_token(token))
    return await session.scalar(stmt)


async def refresh(session: AsyncSession, token: str | None) -> int:
    refresh_session = await _find_session(session, token) if token else None
    if refresh_session is None:
        raise UnauthorizedError("Invalid refresh token")
    if refresh_session.revoked_at is not None:
        raise UnauthorizedError("Refresh token has been revoked")
    if refresh_session.expires_at <= dt.datetime.now(dt.UTC):
        raise UnauthorizedError("Refresh token has expired")
    return refresh_session.user_id


async def revoke(session: AsyncSession, token: str | None) -> None:
    refresh_session = await _find_session(session, token) if token else None
    if refresh_session is None or refresh_session.revoked_at is not None:
        return
    refresh_session.revoked_at = dt.datetime.now(dt.UTC)
    await session.commit()
