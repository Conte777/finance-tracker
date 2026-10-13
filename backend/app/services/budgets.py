from sqlalchemy import Select, exists, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.errors import ConflictError, InvalidDataError, NotFoundError
from app.models import Budget, Category, CategoryType
from app.schemas.budget import BudgetCreate, BudgetUpdate
from app.services.categories import find_category


def _owned_budgets(user_id: int) -> Select:
    return select(Budget).join(Category).where(Category.user_id == user_id)


async def list_budgets(session: AsyncSession, user_id: int) -> list[Budget]:
    return list(await session.scalars(_owned_budgets(user_id).order_by(Budget.id)))


async def get_budget(session: AsyncSession, user_id: int, budget_id: int) -> Budget:
    budget = await session.scalar(_owned_budgets(user_id).where(Budget.id == budget_id))
    if budget is None:
        raise NotFoundError(f"Budget {budget_id} not found")
    return budget


async def create_budget(session: AsyncSession, user_id: int, data: BudgetCreate) -> Budget:
    category = await find_category(session, user_id, data.category_id)
    if category is None:
        raise InvalidDataError(f"Category {data.category_id} does not exist")
    if category.type != CategoryType.EXPENSE:
        raise InvalidDataError("Budgets can only be set for expense categories")
    if await session.scalar(select(exists().where(Budget.category_id == data.category_id))):
        raise ConflictError(f"Budget for category {data.category_id} already exists")

    budget = Budget(**data.model_dump())
    session.add(budget)
    await session.commit()
    return budget


async def update_budget(
    session: AsyncSession, user_id: int, budget_id: int, data: BudgetUpdate
) -> Budget:
    budget = await get_budget(session, user_id, budget_id)
    budget.limit = data.limit
    await session.commit()
    return budget


async def delete_budget(session: AsyncSession, user_id: int, budget_id: int) -> None:
    budget = await get_budget(session, user_id, budget_id)
    await session.delete(budget)
    await session.commit()
