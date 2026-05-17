from typing import Optional
from pydantic import BaseModel, ConfigDict


class SiteConfigOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    brand_name: str
    slogan_main: str
    slogan_sub: str
    intro_md: str
    principle_md: str
    footer_quote: str
    cta_phone: str
    kaiti_enabled: bool


class SiteConfigUpdate(BaseModel):
    brand_name: Optional[str] = None
    slogan_main: Optional[str] = None
    slogan_sub: Optional[str] = None
    intro_md: Optional[str] = None
    principle_md: Optional[str] = None
    footer_quote: Optional[str] = None
    cta_phone: Optional[str] = None
    kaiti_enabled: Optional[bool] = None


class BannerOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    position: str
    image_key: Optional[str] = None
    image_url: Optional[str] = None
    headline: str
    subline: str
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    sort_order: int
    is_active: bool


class BannerCreate(BaseModel):
    position: str = "home"
    image_key: Optional[str] = None
    headline: str = ""
    subline: str = ""
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True


class BannerUpdate(BaseModel):
    position: Optional[str] = None
    image_key: Optional[str] = None
    headline: Optional[str] = None
    subline: Optional[str] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None
