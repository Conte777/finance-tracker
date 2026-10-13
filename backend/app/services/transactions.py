from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import contains_eager

from app.errors import InvalidDataError, NotFoundError
from app.models import Category, Transaction
from app.schemas.transaction import TransactionCreate, TransactionFilter, TransactionUpdate
from app.services.categories import find_category


async def _existing_category(session: AsyncSession, user_id: int, category_id: int) -> Category:
    category = await find_category(session, user_id, category_id)
    if category is None:
        raise InvalidDataError(f"Category {category_id} does not exist")
    return category


def _apply_filter(stmt: Select, f: TransactionFilter) -> Select:
    if f.type is not None:
        stmt = stmt.where(Category.type == f.type)
    if f.category_id is not None:
        stmt = stmt.where(Transaction.category_id == f.category_id)
    if f.q is not None:
        stmt = stmt.where(Transaction.comment.icontains(f.q, autoescape=True))
    if f.date_from is not None:
        stmt = stmt.where(Transaction.date >= f.date_from)
    if f.date_to is not None:
        stmt = stmt.where(Transaction.date <= f.date_to)
    return stmt


def _owned_transactions(user_id: int) -> Select:
    return select(Transaction).join(Transaction.category).where(Category.user_id == user_id)


async def list_transactions(
    session: AsyncSession, user_id: int, f: TransactionFilter
) -> tuple[list[Transaction], int]:
    base = _owned_transactions(user_id)
    filtered = _apply_filter(base, f)

    total = await session.scalar(select(func.count()).select_from(filtered.subquery())) or 0
    stmt = (
        filtered.options(contains_eager(Transaction.category))
        .order_by(Transaction.date.desc(), Transaction.id.desc())
        .offset((f.page - 1) * f.size)
        .limit(f.size)
    )
    return list(await session.scalars(stmt)), total


async def get_transaction(session: AsyncSession, user_id: int, transaction_id: int) -> Transaction:
    stmt = (
        _owned_transactions(user_id)
        .options(contains_eager(Transaction.category))
        .where(Transaction.id == transaction_id)
    )
    transaction = await session.scalar(stmt)
    if transaction is None:
        raise NotFoundError(f"Transaction {transaction_id} not found")
    return transaction


async def create_transaction(
    session: AsyncSession, user_id: int, data: TransactionCreate
) -> Transaction:
    category = await _existing_category(session, user_id, data.category_id)
    transaction = Transaction(**data.model_dump(exclude={"category_id"}), category=category)
    session.add(transaction)
    await session.commit()
    return transaction


async def update_transaction(
    session: AsyncSession, user_id: int, transaction_id: int, data: TransactionUpdate
) -> Transaction:
    transaction = await get_transaction(session, user_id, transaction_id)
    changes = data.model_dump(exclude_unset=True, exclude_none=True)

    if "category_id" in changes:
        transaction.category = await _existing_category(
            session, user_id, changes.pop("category_id")
        )
    for field, value in changes.items():
        setattr(transaction, field, value)
    await session.commit()
    return transaction


async def delete_transaction(session: AsyncSession, user_id: int, transaction_id: int) -> None:
    transaction = await get_transaction(session, user_id, transaction_id)
    await session.delete(transaction)
    await session.commit()
