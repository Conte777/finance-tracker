from fastapi import APIRouter, status

from app.db import SessionDep
from app.models import Budget
from app.schemas.budget import BudgetCreate, BudgetRead, BudgetUpdate
from app.services import budgets as service

router = APIRouter(prefix="/budgets", tags=["budgets"])


@router.get("", response_model=list[BudgetRead])
async def list_budgets(session: SessionDep) -> list[Budget]:
    return await service.list_budgets(session)


@router.get("/{budget_id}", response_model=BudgetRead)
async def get_budget(budget_id: int, session: SessionDep) -> Budget:
    return await service.get_budget(session, budget_id)


@router.post("", response_model=BudgetRead, status_code=status.HTTP_201_CREATED)
async def create_budget(data: BudgetCreate, session: SessionDep) -> Budget:
    return await service.create_budget(session, data)


@router.patch("/{budget_id}", response_model=BudgetRead)
async def update_budget(budget_id: int, data: BudgetUpdate, session: SessionDep) -> Budget:
    return await service.update_budget(session, budget_id, data)


@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_budget(budget_id: int, session: SessionDep) -> None:
    await service.delete_budget(session, budget_id)
