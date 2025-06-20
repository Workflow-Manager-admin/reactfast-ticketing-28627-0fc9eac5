"""
User profile management endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import models, schemas
from ..auth import get_current_user, get_password_hash

router = APIRouter(
    prefix="/users",
    tags=["users"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# PUBLIC_INTERFACE
@router.get("/me", response_model=schemas.UserOut, summary="Get current user's profile")
def read_profile(current_user: models.User = Depends(get_current_user)):
    """
    Get details of the current logged in user.
    """
    return current_user


# PUBLIC_INTERFACE
@router.put("/me", response_model=schemas.UserOut, summary="Update current user's profile")
def update_profile(
    update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Update fields (email, full name, password) for the current user.
    """
    user = db.query(models.User).filter(models.User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if update.email is not None:
        user.email = update.email
    if update.full_name is not None:
        user.full_name = update.full_name
    if update.password is not None:
        user.hashed_password = get_password_hash(update.password)
    db.commit()
    db.refresh(user)
    return user
