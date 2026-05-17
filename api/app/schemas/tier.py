from typing import Optional
from pydantic import BaseModel, ConfigDict


class TierOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    slug: str
    fee: int
    discount_text: str
    benefits_md: str
    accent_color: str
    icon_key: Optional[str] = None
    sort_order: int
    is_active: bool


class TierIn(BaseModel):
    name: str
    slug: str
    fee: int = 0
    discount_text: str = ""
    benefits_md: str = ""
    accent_color: str = "#B8945A"
    icon_key: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True
