from sqlalchemy import exists, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.errors import ConflictError, InvalidDataError, NotFoundError
from app.models import Budget, Category, CategoryType
from app.schemas.budget import BudgetCreate, BudgetUpdate


async def list_budgets(session: AsyncSession) -> list[Budget]:
    return list(await session.scalars(select(Budget).order_by(Budget.id)))


async def get_budget(session: AsyncSession, budget_id: int) -> Budget:
    budget = await session.get(Budget, budget_id)
    if budget is None:
        raise NotFoundError(f"Budget {budget_id} not found")
    return budget


async def create_budget(session: AsyncSession, data: BudgetCreate) -> Budget:
    category = await session.get(Category, data.category_id)
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


async def update_budget(session: AsyncSession, budget_id: int, data: BudgetUpdate) -> Budget:
    budget = await get_budget(session, budget_id)
    budget.limit = data.limit
    await session.commit()
    return budget


async def delete_budget(session: AsyncSession, budget_id: int) -> None:
    budget = await get_budget(session, budget_id)
    await session.delete(budget)
    await session.commit()
