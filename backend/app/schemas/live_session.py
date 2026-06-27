from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class LiveSessionBase(BaseModel):
    title: str
    tiktok_live_url: Optional[str] = None
    start_time: Optional[datetime] = None
    note: Optional[str] = None
    status: str = "preparing"

class LiveSessionCreate(LiveSessionBase):
    pass

class LiveSessionResponse(LiveSessionBase):
    id: UUID
    created_by: UUID
    created_at: datetime
    ended_at: Optional[datetime] = None

    class Config:
        from_attributes = True
