from datetime import datetime
from typing import List, Union

from pydantic import BaseModel, EmailStr


class NoteBase(BaseModel):
    title: str
    id: int
    done: bool

    user_id: int


class NoteCreate(NoteBase):
    date_added = datetime.now().date()


class Note(NoteBase):
    date_added: datetime


class EventBase(BaseModel):
    title: str
    id: int
    happened: bool

    user_id: int


class EventCreate(EventBase):
    date_added = datetime.now().date()


class Event(EventBase):
    date_added: datetime


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(BaseModel):
    password: str
    username: str


class UserInDB(UserBase):
    hashed_password: str


class User(UserBase):
    user_id: int
    username: str
    events: List[Event] = []
    notes: List[Note] = []

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Union[str, None] = None
