"""
Authentication endpoints for login and registration.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from ..database import SessionLocal
from ..schemas import UserCreate, UserOut, Token
from .. import models
from ..auth import get_password_hash, authenticate_user, create_access_token, get_current_user

from datetime import timedelta

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# PUBLIC_INTERFACE
@router.post("/register", response_model=UserOut, summary="Register a new user")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user in the system.
    """
    if db.query(models.User).filter(
        (models.User.username == user.username) | (models.User.email == user.email)
    ).first():
        raise HTTPException(status_code=400, detail="Username or email already registered.")
    hashed_pw = get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pw,
        full_name=user.full_name,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# PUBLIC_INTERFACE
@router.post("/token", response_model=Token, summary="Login and obtain JWT token")
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    """
    Obtain a JWT access token by sending a username and password.
    """
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=60 * 24)
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires,
    )
    return {"access_token": access_token, "token_type": "bearer"}


# PUBLIC_INTERFACE
@router.get("/me", response_model=UserOut, summary="Get current authenticated user")
def get_me(current_user: models.User = Depends(get_current_user)):
    """
    Get current authenticated user's details.
    """
    return current_user
