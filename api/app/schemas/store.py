from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class StoreOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    slug: str
    is_flagship: bool
    address: str
    phone: str
    hours: str
    intro_md: str
    image_key: Optional[str] = None
    image_url: Optional[str] = None
    gallery: List[str] = []
    gallery_urls: List[str] = []
    map_url: Optional[str] = None
    sort_order: int
    is_active: bool


class StoreIn(BaseModel):
    name: str
    slug: str
    is_flagship: bool = False
    address: str = ""
    phone: str = ""
    hours: str = "10:00 - 22:00"
    intro_md: str = ""
    image_key: Optional[str] = None
    gallery: List[str] = []
    map_url: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True
