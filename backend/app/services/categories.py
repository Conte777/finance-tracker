from sqlalchemy import exists, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.errors import ConflictError, NotFoundError
from app.models import Budget, Category, CategoryType, Transaction
from app.schemas.category import CategoryCreate, CategoryUpdate


async def list_categories(
    session: AsyncSession, user_id: int, type_: CategoryType | None
) -> list[Category]:
    stmt = select(Category).where(Category.user_id == user_id).order_by(Category.id)
    if type_ is not None:
        stmt = stmt.where(Category.type == type_)
    return list(await session.scalars(stmt))


async def find_category(session: AsyncSession, user_id: int, category_id: int) -> Category | None:
    stmt = select(Category).where(Category.id == category_id, Category.user_id == user_id)
    return await session.scalar(stmt)


async def get_category(session: AsyncSession, user_id: int, category_id: int) -> Category:
    category = await find_category(session, user_id, category_id)
    if category is None:
        raise NotFoundError(f"Category {category_id} not found")
    return category


async def _ensure_name_free(
    session: AsyncSession,
    user_id: int,
    name: str,
    type_: CategoryType,
    exclude_id: int | None = None,
) -> None:
    conditions = [Category.user_id == user_id, Category.name == name, Category.type == type_]
    if exclude_id is not None:
        conditions.append(Category.id != exclude_id)
    if await session.scalar(select(exists().where(*conditions))):
        raise ConflictError(f"Category '{name}' already exists for type '{type_}'")


async def _count_transactions(session: AsyncSession, category_id: int) -> int:
    stmt = select(func.count()).where(Transaction.category_id == category_id)
    return await session.scalar(stmt) or 0


async def create_category(session: AsyncSession, user_id: int, data: CategoryCreate) -> Category:
    await _ensure_name_free(session, user_id, data.name, data.type)
    category = Category(**data.model_dump(), user_id=user_id)
    session.add(category)
    await session.commit()
    return category


async def update_category(
    session: AsyncSession, user_id: int, category_id: int, data: CategoryUpdate
) -> Category:
    category = await get_category(session, user_id, category_id)
    changes = data.model_dump(exclude_unset=True, exclude_none=True)

    new_type = changes.get("type", category.type)
    if new_type != category.type:
        if count := await _count_transactions(session, category_id):
            raise ConflictError(
                f"Cannot change type of category {category_id}: it has {count} transactions"
            )
        has_budget = await session.scalar(select(exists().where(Budget.category_id == category_id)))
        if has_budget:
            raise ConflictError(
                f"Cannot change type of category {category_id}: it has a budget, delete it first"
            )

    new_name = changes.get("name", category.name)
    if new_name != category.name or new_type != category.type:
        await _ensure_name_free(session, user_id, new_name, new_type, exclude_id=category_id)

    for field, value in changes.items():
        setattr(category, field, value)
    await session.commit()
    return category


async def delete_category(session: AsyncSession, user_id: int, category_id: int) -> None:
    category = await get_category(session, user_id, category_id)
    if count := await _count_transactions(session, category_id):
        raise ConflictError(
            f"Cannot delete category {category_id}: it has {count} transactions, "
            "delete or move them first"
        )
    await session.delete(category)
    await session.commit()
