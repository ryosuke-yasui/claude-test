import enum
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class Sex(str, enum.Enum):
    male = "male"
    female = "female"
    other = "other"


class AddressBase(BaseModel):
    street: str = Field(min_length=1, max_length=200)
    city: str = Field(min_length=1, max_length=100)
    state: str | None = Field(default=None, max_length=100)
    zip_code: str | None = Field(default=None, max_length=20)
    country: str = Field(min_length=1, max_length=100)


class AddressCreate(AddressBase):
    pass


class Address(AddressBase):
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)


class UserBase(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    age: int = Field(ge=0, le=150)
    sex: Sex
    phone: str | None = Field(default=None, max_length=30, pattern=r"^\+?[\d\s\-().]{7,30}$")


class UserCreate(UserBase):
    addresses: list[AddressCreate] = Field(default_factory=list)


class UserUpdate(UserBase):
    addresses: list[AddressCreate] = Field(default_factory=list)


class User(UserBase):
    id: int
    created_at: datetime
    addresses: list[Address] = []
    model_config = ConfigDict(from_attributes=True)
