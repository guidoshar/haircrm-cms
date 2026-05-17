from sqlalchemy import String, Integer, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TimestampMixin


class MemberTier(Base, TimestampMixin):
    __tablename__ = "member_tier"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(40), unique=True)
    slug: Mapped[str] = mapped_column(String(40), unique=True)
    fee: Mapped[int] = mapped_column(Integer, default=0)  # 办卡金额（元）
    discount_text: Mapped[str] = mapped_column(String(40), default="")  # 7.8折 / 6.8折 / 会员价
    benefits_md: Mapped[str] = mapped_column(Text, default="")
    accent_color: Mapped[str] = mapped_column(String(20), default="#B8945A")
    icon_key: Mapped[str | None] = mapped_column(String(60), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
