from sqlalchemy import String, Integer, Boolean, Text, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin


class Category(Base, TimestampMixin):
    __tablename__ = "category"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(60), unique=True)
    slug: Mapped[str] = mapped_column(String(60), unique=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    icon_key: Mapped[str | None] = mapped_column(String(60), nullable=True)  # FluentIcon key
    hero_image_key: Mapped[str | None] = mapped_column(String(255), nullable=True)
    accent_color: Mapped[str | None] = mapped_column(String(20), nullable=True)
    tagline: Mapped[str | None] = mapped_column(String(120), nullable=True)

    services: Mapped[list["Service"]] = relationship(back_populates="category", cascade="all, delete-orphan", order_by="Service.sort_order")


class Service(Base, TimestampMixin):
    __tablename__ = "service"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("category.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(80))
    slug: Mapped[str] = mapped_column(String(80), unique=True)
    summary: Mapped[str] = mapped_column(String(200), default="")
    principle_md: Mapped[str] = mapped_column(Text, default="")
    value_md: Mapped[str] = mapped_column(Text, default="")
    products_md: Mapped[str] = mapped_column(Text, default="")  # 我们用什么产品/成分
    time_min: Mapped[int] = mapped_column(Integer, default=0)
    cover_image_key: Mapped[str | None] = mapped_column(String(255), nullable=True)
    gallery: Mapped[list] = mapped_column(JSON, default=list)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    category: Mapped["Category"] = relationship(back_populates="services")
    steps: Mapped[list["ServiceStep"]] = relationship(back_populates="service", cascade="all, delete-orphan", order_by="ServiceStep.idx")
    price: Mapped["ServicePrice"] = relationship(back_populates="service", uselist=False, cascade="all, delete-orphan")
    packages: Mapped[list["ServicePackage"]] = relationship(back_populates="service", cascade="all, delete-orphan", order_by="ServicePackage.sort_order")


class ServiceStep(Base):
    __tablename__ = "service_step"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    service_id: Mapped[int] = mapped_column(ForeignKey("service.id", ondelete="CASCADE"), index=True)
    idx: Mapped[int] = mapped_column(Integer, default=0)
    title: Mapped[str] = mapped_column(String(80))
    minutes: Mapped[int] = mapped_column(Integer, default=0)
    description: Mapped[str] = mapped_column(Text, default="")

    service: Mapped["Service"] = relationship(back_populates="steps")


class ServicePrice(Base):
    """单一服务的 4 档基础价 + 体验价。金额单位：元（int）。"""
    __tablename__ = "service_price"
    service_id: Mapped[int] = mapped_column(ForeignKey("service.id", ondelete="CASCADE"), primary_key=True)
    store_price: Mapped[int] = mapped_column(Integer, default=0)
    member_price: Mapped[int] = mapped_column(Integer, default=0)
    platinum_price: Mapped[int] = mapped_column(Integer, default=0)
    diamond_price: Mapped[int] = mapped_column(Integer, default=0)
    taste_price: Mapped[int] = mapped_column(Integer, default=0)

    service: Mapped["Service"] = relationship(back_populates="price")


class ServicePackage(Base):
    """套餐/课程价。kind: course5(5次课程)/ten1(10送1)/quarter(季卡18次)/half(半年卡36次)/addon(其他)"""
    __tablename__ = "service_package"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    service_id: Mapped[int] = mapped_column(ForeignKey("service.id", ondelete="CASCADE"), index=True)
    kind: Mapped[str] = mapped_column(String(20), default="course5")
    label: Mapped[str] = mapped_column(String(80))
    price: Mapped[int] = mapped_column(Integer, default=0)
    times: Mapped[int] = mapped_column(Integer, default=0)
    gift_count: Mapped[int] = mapped_column(Integer, default=0)
    options_text: Mapped[str | None] = mapped_column(String(255), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    service: Mapped["Service"] = relationship(back_populates="packages")
