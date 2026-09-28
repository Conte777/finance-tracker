from pydantic import BaseModel, ConfigDict

from app.schemas.common import Money


class BudgetCreate(BaseModel):
    category_id: int
    limit: Money


class BudgetUpdate(BaseModel):
    limit: Money


class BudgetRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category_id: int
    limit: Money
