from typing import Annotated

from fastapi import APIRouter, Query, status

from app.db import SessionDep
from app.models import Transaction
from app.schemas.common import Page
from app.schemas.transaction import (
    TransactionCreate,
    TransactionFilter,
    TransactionRead,
    TransactionUpdate,
)
from app.services import transactions as service

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("", response_model=Page[TransactionRead])
async def list_transactions(
    session: SessionDep, f: Annotated[TransactionFilter, Query()]
) -> Page[TransactionRead]:
    items, total = await service.list_transactions(session, f)
    return Page(items=[TransactionRead.model_validate(t) for t in items], total=total)


@router.get("/{transaction_id}", response_model=TransactionRead)
async def get_transaction(transaction_id: int, session: SessionDep) -> Transaction:
    return await service.get_transaction(session, transaction_id)


@router.post("", response_model=TransactionRead, status_code=status.HTTP_201_CREATED)
async def create_transaction(data: TransactionCreate, session: SessionDep) -> Transaction:
    return await service.create_transaction(session, data)


@router.patch("/{transaction_id}", response_model=TransactionRead)
async def update_transaction(
    transaction_id: int, data: TransactionUpdate, session: SessionDep
) -> Transaction:
    return await service.update_transaction(session, transaction_id, data)


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction(transaction_id: int, session: SessionDep) -> None:
    await service.delete_transaction(session, transaction_id)
