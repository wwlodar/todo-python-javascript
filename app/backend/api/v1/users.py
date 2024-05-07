import uuid
from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.backend.api.v1.auth import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    authenticate_user,
    create_access_token,
    create_refresh_token,
    delete_access_token,
    get_current_user,
    get_password_hash,
)
from app.backend.sql_app.crud import create_user, get_user_by_email
from app.backend.sql_app.main import get_db
from app.backend.sql_app.schemas import TokenData, UserCreate, UserInDB

router = APIRouter()


@router.post("/register")
def register_new_user(data: UserCreate, db: Session = Depends(get_db)):
    # querying database to check if user already exist
    if data.email:
        user = get_user_by_email(email=data.email, db=db)
        if user is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exist",
            )
        hashed_password = get_password_hash(data.password)
        db_user = UserInDB(
            username=data.username,
            email=data.email,
            hashed_password=hashed_password,
            user_id=str(uuid.uuid4()),
        )
        user = create_user(user=db_user, db=db)
        if user:
            return {"status": f"User {db_user.username} was created"}


@router.get("/user")
def get_user_info(current_user: UserInDB = Depends(get_current_user)):
    return current_user.email


@router.post("/login")
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db),
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(subject=user.email)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "refresh_token": refresh_token,
    }


@router.post("/logout")
def logout(
    current_user: UserInDB = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    token = TokenData(username=current_user.username, db=db)
    return delete_access_token(token)
