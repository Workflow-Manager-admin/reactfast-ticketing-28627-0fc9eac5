"""
Dashboard overview endpoint - summarises ticket and user information for logged-in user.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import SessionLocal
from .. import models, schemas
from ..auth import get_current_user

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# PUBLIC_INTERFACE
@router.get(
    "/",
    response_model=schemas.DashboardOverview,
    summary="Get dashboard overview for current user",
)
def get_dashboard(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    """
    Returns a dashboard overview (number of tickets, open tickets, closed tickets, assigned tickets).
    """
    total_tickets = (
        db.query(models.Ticket).filter(models.Ticket.owner_id == current_user.id).count()
    )
    open_tickets = (
        db.query(models.Ticket)
        .filter(
            models.Ticket.owner_id == current_user.id,
            models.Ticket.status == "open",
        )
        .count()
    )
    closed_tickets = (
        db.query(models.Ticket)
        .filter(
            models.Ticket.owner_id == current_user.id,
            models.Ticket.status == "closed",
        )
        .count()
    )
    assigned_tickets = total_tickets  # Since only user's tickets are counted
    return {
        "total_tickets": total_tickets,
        "open_tickets": open_tickets,
        "closed_tickets": closed_tickets,
        "assigned_tickets": assigned_tickets,
    }
