"""
Ticket management endpoints: CRUD for tickets.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import SessionLocal
from .. import models, schemas
from ..auth import get_current_user

router = APIRouter(
    prefix="/tickets",
    tags=["tickets"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# PUBLIC_INTERFACE
@router.post(
    "/", response_model=schemas.TicketOut, status_code=201, summary="Create a new ticket"
)
def create_ticket(
    ticket: schemas.TicketCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Create a new ticket assigned to the current user.
    """
    db_ticket = models.Ticket(
        title=ticket.title,
        description=ticket.description,
        status=ticket.status or "open",
        priority=ticket.priority or "normal",
        owner_id=current_user.id,
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


# PUBLIC_INTERFACE
@router.get(
    "/", response_model=list[schemas.TicketOut], summary="List all tickets for current user"
)
def list_tickets(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Retrieve all tickets belonging to the current user.
    """
    tickets = (
        db.query(models.Ticket).filter(models.Ticket.owner_id == current_user.id).all()
    )
    return tickets


# PUBLIC_INTERFACE
@router.get(
    "/{ticket_id}", response_model=schemas.TicketOut, summary="Get ticket by ID"
)
def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Retrieve ticket details by ticket ID.
    """
    ticket = (
        db.query(models.Ticket)
        .filter(models.Ticket.id == ticket_id, models.Ticket.owner_id == current_user.id)
        .first()
    )
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


# PUBLIC_INTERFACE
@router.put(
    "/{ticket_id}", response_model=schemas.TicketOut, summary="Update an existing ticket"
)
def update_ticket(
    ticket_id: int,
    update: schemas.TicketUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Update a ticket by ID, owned by the current user.
    """
    ticket = (
        db.query(models.Ticket)
        .filter(models.Ticket.id == ticket_id, models.Ticket.owner_id == current_user.id)
        .first()
    )
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    update_data = update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(ticket, key, value)
    db.commit()
    db.refresh(ticket)
    return ticket


# PUBLIC_INTERFACE
@router.delete(
    "/{ticket_id}", status_code=204, summary="Delete a ticket"
)
def delete_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Delete a ticket owned by the current user.
    """
    ticket = (
        db.query(models.Ticket)
        .filter(models.Ticket.id == ticket_id, models.Ticket.owner_id == current_user.id)
        .first()
    )
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    db.delete(ticket)
    db.commit()
    return
