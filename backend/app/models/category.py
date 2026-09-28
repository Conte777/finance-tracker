from enum import StrEnum

from sqlalchemy import Enum, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class CategoryType(StrEnum):
    INCOME = "income"
    EXPENSE = "expense"


class Category(Base):
    __tablename__ = "categories"
    __table_args__ = (UniqueConstraint("name", "type"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50))
    type: Mapped[CategoryType] = mapped_column(
        Enum(CategoryType, name="category_type", values_callable=lambda e: [m.value for m in e])
    )
    color: Mapped[str] = mapped_column(String(7))
    icon: Mapped[str] = mapped_column(String(30))
