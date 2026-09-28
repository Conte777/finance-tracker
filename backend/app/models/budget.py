from decimal import Decimal

from sqlalchemy import CheckConstraint, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Budget(Base):
    __tablename__ = "budgets"
    __table_args__ = (CheckConstraint('"limit" > 0', name="limit_positive"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id", ondelete="CASCADE"), unique=True
    )
    limit: Mapped[Decimal] = mapped_column(Numeric(12, 2))
