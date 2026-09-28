from fastapi import FastAPI
from sqlalchemy import text

from app.api import budgets, categories, transactions
from app.db import SessionDep
from app.errors import register_error_handlers

app = FastAPI(title="Finance API", version="0.1.0")
register_error_handlers(app)

app.include_router(categories.router)
app.include_router(transactions.router)
app.include_router(budgets.router)


@app.get("/health", tags=["health"])
async def health(session: SessionDep) -> dict[str, str]:
    await session.execute(text("SELECT 1"))
    return {"status": "ok"}
