from sqlalchemy import String, Integer, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TimestampMixin


class SiteConfig(Base, TimestampMixin):
    __tablename__ = "site_config"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    brand_name: Mapped[str] = mapped_column(String(80), default="Sipimo · 诗碧曼草本养护中心")
    slogan_main: Mapped[str] = mapped_column(String(120), default="草本精华  缕缕用心")
    slogan_sub: Mapped[str] = mapped_column(String(200), default="诗碧曼养发，让你持久年轻")
    intro_md: Mapped[str] = mapped_column(Text, default="")
    principle_md: Mapped[str] = mapped_column(Text, default="")
    footer_quote: Mapped[str] = mapped_column(String(200), default="请尽情享受城市中的小憩时刻，让头发恢复活力。")
    cta_phone: Mapped[str] = mapped_column(String(40), default="")
    kaiti_enabled: Mapped[bool] = mapped_column(Boolean, default=True)


class Banner(Base, TimestampMixin):
    __tablename__ = "banner"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    position: Mapped[str] = mapped_column(String(40), default="home", index=True)  # home/membership/services
    image_key: Mapped[str | None] = mapped_column(String(255), nullable=True)
    headline: Mapped[str] = mapped_column(String(120), default="")
    subline: Mapped[str] = mapped_column(String(200), default="")
    cta_text: Mapped[str | None] = mapped_column(String(40), nullable=True)
    cta_link: Mapped[str | None] = mapped_column(String(255), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
