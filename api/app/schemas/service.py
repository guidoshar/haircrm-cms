from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class StepOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    idx: int
    title: str
    minutes: int
    description: str


class StepIn(BaseModel):
    idx: int = 0
    title: str
    minutes: int = 0
    description: str = ""


class PriceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    store_price: int
    member_price: int
    platinum_price: int
    diamond_price: int
    taste_price: int


class PriceIn(BaseModel):
    store_price: int = 0
    member_price: int = 0
    platinum_price: int = 0
    diamond_price: int = 0
    taste_price: int = 0


class PackageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    kind: str
    label: str
    price: int
    times: int
    gift_count: int
    options_text: Optional[str] = None
    sort_order: int


class PackageIn(BaseModel):
    kind: str = "course5"
    label: str
    price: int = 0
    times: int = 0
    gift_count: int = 0
    options_text: Optional[str] = None
    sort_order: int = 0


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    slug: str
    sort_order: int
    icon_key: Optional[str] = None
    hero_image_key: Optional[str] = None
    hero_image_url: Optional[str] = None
    accent_color: Optional[str] = None
    tagline: Optional[str] = None


class CategoryIn(BaseModel):
    name: str
    slug: str
    sort_order: int = 0
    icon_key: Optional[str] = None
    hero_image_key: Optional[str] = None
    accent_color: Optional[str] = None
    tagline: Optional[str] = None


class ServiceListOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    category_id: int
    name: str
    slug: str
    summary: str
    time_min: int
    cover_image_key: Optional[str] = None
    cover_image_url: Optional[str] = None
    sort_order: int
    is_active: bool
    price: Optional[PriceOut] = None


class ServiceFullOut(ServiceListOut):
    principle_md: str = ""
    value_md: str = ""
    products_md: str = ""
    gallery: List[str] = []
    gallery_urls: List[str] = []
    steps: List[StepOut] = []
    packages: List[PackageOut] = []


class ServiceIn(BaseModel):
    category_id: int
    name: str
    slug: str
    summary: str = ""
    principle_md: str = ""
    value_md: str = ""
    products_md: str = ""
    time_min: int = 0
    cover_image_key: Optional[str] = None
    gallery: List[str] = []
    sort_order: int = 0
    is_active: bool = True


class CategoryWithServices(CategoryOut):
    services: List[ServiceFullOut] = []
