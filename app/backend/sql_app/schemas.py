from datetime import datetime
from typing import List, Union

from pydantic import BaseModel, EmailStr


class NoteBase(BaseModel):
    title: str
    note_id: int
    done: bool
    user_id: str


class NoteCreate(NoteBase):
    date_added = datetime.now().date()


class Note(NoteBase):
    date_added: datetime


class EventBase(BaseModel):
    title: str
    event_id: int
    happened: bool
    user_id: str


class EventCreate(BaseModel):
    date: datetime
    title: str


class EventUserCreate(BaseModel):
    date: datetime
    title: str
    user_id: str


class Event(EventBase):
    date: datetime


class UserBase(BaseModel):
    email: EmailStr
    username: str
    user_id: str


class UserCreate(BaseModel):
    password: str
    username: str
    email: EmailStr


class UserInDB(UserBase):
    hashed_password: str


class User(UserBase):
    events: List[Event] = []
    notes: List[Note] = []

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Union[str, None] = None
