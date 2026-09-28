from fastapi import APIRouter, status

from app.db import SessionDep
from app.models import Category, CategoryType
from app.schemas.category import CategoryCreate, CategoryRead, CategoryUpdate
from app.services import categories as service

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[CategoryRead])
async def list_categories(session: SessionDep, type: CategoryType | None = None) -> list[Category]:
    return await service.list_categories(session, type)


@router.get("/{category_id}", response_model=CategoryRead)
async def get_category(category_id: int, session: SessionDep) -> Category:
    return await service.get_category(session, category_id)


@router.post("", response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
async def create_category(data: CategoryCreate, session: SessionDep) -> Category:
    return await service.create_category(session, data)


@router.patch("/{category_id}", response_model=CategoryRead)
async def update_category(category_id: int, data: CategoryUpdate, session: SessionDep) -> Category:
    return await service.update_category(session, category_id, data)


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(category_id: int, session: SessionDep) -> None:
    await service.delete_category(session, category_id)
