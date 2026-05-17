from typing import Optional
from pydantic import BaseModel, ConfigDict


class MediaOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    key: str
    thumb_key: Optional[str] = None
    mime: str
    width: int
    height: int
    bytes: int
    alt: str
    tag: Optional[str] = None
    url: Optional[str] = None
    thumb_url: Optional[str] = None


class MediaUpdate(BaseModel):
    alt: Optional[str] = None
    tag: Optional[str] = None
