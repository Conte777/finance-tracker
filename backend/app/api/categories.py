from fastapi import APIRouter, status

from app.api.deps import CurrentUser
from app.db import SessionDep
from app.models import Category, CategoryType
from app.schemas.category import CategoryCreate, CategoryRead, CategoryUpdate
from app.services import categories as service

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[CategoryRead])
async def list_categories(
    session: SessionDep, user: CurrentUser, type: CategoryType | None = None
) -> list[Category]:
    return await service.list_categories(session, user.id, type)


@router.get("/{category_id}", response_model=CategoryRead)
async def get_category(category_id: int, session: SessionDep, user: CurrentUser) -> Category:
    return await service.get_category(session, user.id, category_id)


@router.post("", response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
async def create_category(data: CategoryCreate, session: SessionDep, user: CurrentUser) -> Category:
    return await service.create_category(session, user.id, data)


@router.patch("/{category_id}", response_model=CategoryRead)
async def update_category(
    category_id: int, data: CategoryUpdate, session: SessionDep, user: CurrentUser
) -> Category:
    return await service.update_category(session, user.id, category_id, data)


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(category_id: int, session: SessionDep, user: CurrentUser) -> None:
    await service.delete_category(session, user.id, category_id)
