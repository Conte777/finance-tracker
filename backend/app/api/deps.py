from typing import Annotated

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.db import SessionDep
from app.errors import UnauthorizedError
from app.models import User
from app.security import decode_access_token

bearer = HTTPBearer(auto_error=False)


async def get_current_user(
    session: SessionDep,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)],
) -> User:
    if credentials is None:
        raise UnauthorizedError("Not authenticated")
    user_id = decode_access_token(credentials.credentials)
    user = await session.get(User, user_id) if user_id is not None else None
    if user is None:
        raise UnauthorizedError("Invalid or expired access token")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
