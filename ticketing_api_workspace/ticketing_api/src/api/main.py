"""
Main FastAPI entrypoint for the ticketing system.
Initializes DB, includes routers, and configures OpenAPI metadata.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth_router, tickets_router, users_router, dashboard_router

app = FastAPI(
    title="Ticketing API",
    description="API backend for the Ticketing System (FastAPI). "
    "Features: Auth, user, profile, tickets CRUD, dashboard aggregation.",
    version="1.0.0",
    openapi_tags=[
        {"name": "auth", "description": "Authentication endpoints (register, login, profile)"},
        {"name": "dashboard", "description": "User dashboard endpoint"},
        {"name": "tickets", "description": "Ticket management, CRUD endpoints"},
        {"name": "users", "description": "User management and profile endpoints"},
    ],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables if not present
Base.metadata.create_all(bind=engine)

# Routers
app.include_router(auth_router.router)
app.include_router(tickets_router.router)
app.include_router(users_router.router)
app.include_router(dashboard_router.router)

@app.get("/", tags=["health"])
def health_check():
    """
    Health check endpoint.
    """
    return {"message": "Healthy"}
