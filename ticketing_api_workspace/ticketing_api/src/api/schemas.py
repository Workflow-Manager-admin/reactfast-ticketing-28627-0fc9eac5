"""
Pydantic schemas for users and tickets for FastAPI.
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# ---------------------- User Schemas ----------------------


class UserBase(BaseModel):
    username: str = Field(..., description="Username of this user")
    email: EmailStr = Field(..., description="Email of this user")
    full_name: Optional[str] = Field(None, description="Full name of this user")


class UserCreate(UserBase):
    password: str = Field(..., description="Password for this user")


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None


class UserOut(UserBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


# ---------------------- Auth Schemas ----------------------


class Token(BaseModel):
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(..., description="Type of token")


class TokenData(BaseModel):
    username: Optional[str] = None


# ---------------------- Ticket Schemas ----------------------


class TicketBase(BaseModel):
    title: str = Field(..., description="Title of the ticket")
    description: Optional[str] = Field(None, description="Description of the ticket")
    status: Optional[str] = Field("open", description="Ticket status")
    priority: Optional[str] = Field("normal", description="Ticket priority")


class TicketCreate(TicketBase):
    pass


class TicketUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None


class TicketOut(TicketBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# ---------------------- Dashboard schema ----------------------


class DashboardOverview(BaseModel):
    total_tickets: int
    open_tickets: int
    closed_tickets: int
    assigned_tickets: int
