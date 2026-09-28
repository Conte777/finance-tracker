from fastapi import FastAPI
from sqlalchemy import text

from app.db import SessionDep

app = FastAPI(title="Finance API", version="0.1.0")


@app.get("/health", tags=["health"])
async def health(session: SessionDep) -> dict[str, str]:
    await session.execute(text("SELECT 1"))
    return {"status": "ok"}
