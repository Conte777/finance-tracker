from typing import Annotated

from pydantic import BaseModel, ConfigDict, StringConstraints

from app.models import CategoryType

Name = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=50)]
Color = Annotated[str, StringConstraints(pattern=r"^#[0-9a-fA-F]{6}$")]
Icon = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=30)]


class CategoryCreate(BaseModel):
    name: Name
    type: CategoryType
    color: Color
    icon: Icon


class CategoryUpdate(BaseModel):
    name: Name | None = None
    type: CategoryType | None = None
    color: Color | None = None
    icon: Icon | None = None


class CategoryRead(CategoryCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
