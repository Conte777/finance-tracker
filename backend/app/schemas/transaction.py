import datetime as dt
from typing import Annotated, Self

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.models import CategoryType
from app.schemas.common import Money

Comment = Annotated[str, Field(max_length=200)]


class TransactionCreate(BaseModel):
    category_id: int
    amount: Money
    date: dt.date
    comment: Comment = ""


class TransactionUpdate(BaseModel):
    category_id: int | None = None
    amount: Money | None = None
    date: dt.date | None = None
    comment: Comment | None = None


class TransactionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    type: CategoryType
    category_id: int
    amount: Money
    date: dt.date
    comment: str


class TransactionFilter(BaseModel):
    type: CategoryType | None = None
    category_id: int | None = None
    q: Annotated[str, Field(min_length=1, max_length=100)] | None = None
    date_from: dt.date | None = None
    date_to: dt.date | None = None
    page: Annotated[int, Field(ge=1)] = 1
    size: Annotated[int, Field(ge=1, le=100)] = 20

    @model_validator(mode="after")
    def check_date_range(self) -> Self:
        if self.date_from and self.date_to and self.date_from > self.date_to:
            raise ValueError("date_from must not be later than date_to")
        return self
