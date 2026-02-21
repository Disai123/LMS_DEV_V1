from pydantic import BaseModel
from typing import Optional

class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False
    category: Optional[str] = "Personal"
    priority: Optional[str] = "medium"
    due_date: Optional[str] = None

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[str] = None

class Todo(TodoBase):
    id: int
    created_at: Optional[str] = None

    class Config:
        orm_mode = True
