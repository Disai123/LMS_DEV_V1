from sqlalchemy import Boolean, Column, Integer, String, DateTime
from database import Base
import datetime

class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    completed = Column(Boolean, default=False)
    category = Column(String, default="Personal")
    priority = Column(String, default="medium")  # low | medium | high
    due_date = Column(String, nullable=True)      # ISO date string e.g. "2024-02-20"
    created_at = Column(String, default=lambda: datetime.datetime.utcnow().isoformat())
