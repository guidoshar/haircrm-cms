"""initial schema

Revision ID: 0001_initial
Revises:
Create Date: 2026-05-17

"""
from alembic import op
import sqlalchemy as sa


revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "site_config",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("brand_name", sa.String(80), nullable=False, server_default="诗碧曼·养发会所"),
        sa.Column("slogan_main", sa.String(120), nullable=False, server_default="草本精华  缕缕用心"),
        sa.Column("slogan_sub", sa.String(200), nullable=False, server_default="诗碧曼养发，让你持久年轻"),
        sa.Column("intro_md", sa.Text, nullable=False, server_default=""),
        sa.Column("principle_md", sa.Text, nullable=False, server_default=""),
        sa.Column("footer_quote", sa.String(200), nullable=False, server_default="请尽情享受城市中的小憩时刻，让头发恢复活力。"),
        sa.Column("cta_phone", sa.String(40), nullable=False, server_default=""),
        sa.Column("kaiti_enabled", sa.Boolean, nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "banner",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("position", sa.String(40), nullable=False, server_default="home"),
        sa.Column("image_key", sa.String(255), nullable=True),
        sa.Column("headline", sa.String(120), nullable=False, server_default=""),
        sa.Column("subline", sa.String(200), nullable=False, server_default=""),
        sa.Column("cta_text", sa.String(40), nullable=True),
        sa.Column("cta_link", sa.String(255), nullable=True),
        sa.Column("sort_order", sa.Integer, nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_banner_position", "banner", ["position"])

    op.create_table(
        "category",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(60), nullable=False, unique=True),
        sa.Column("slug", sa.String(60), nullable=False, unique=True),
        sa.Column("sort_order", sa.Integer, nullable=False, server_default="0"),
        sa.Column("icon_key", sa.String(60), nullable=True),
        sa.Column("hero_image_key", sa.String(255), nullable=True),
        sa.Column("accent_color", sa.String(20), nullable=True),
        sa.Column("tagline", sa.String(120), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "service",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("category_id", sa.Integer, sa.ForeignKey("category.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(80), nullable=False),
        sa.Column("slug", sa.String(80), nullable=False, unique=True),
        sa.Column("summary", sa.String(200), nullable=False, server_default=""),
        sa.Column("principle_md", sa.Text, nullable=False, server_default=""),
        sa.Column("value_md", sa.Text, nullable=False, server_default=""),
        sa.Column("products_md", sa.Text, nullable=False, server_default=""),
        sa.Column("time_min", sa.Integer, nullable=False, server_default="0"),
        sa.Column("cover_image_key", sa.String(255), nullable=True),
        sa.Column("gallery", sa.JSON, nullable=False, server_default=sa.text("'[]'::json")),
        sa.Column("sort_order", sa.Integer, nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_service_category_id", "service", ["category_id"])

    op.create_table(
        "service_step",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("service_id", sa.Integer, sa.ForeignKey("service.id", ondelete="CASCADE"), nullable=False),
        sa.Column("idx", sa.Integer, nullable=False, server_default="0"),
        sa.Column("title", sa.String(80), nullable=False),
        sa.Column("minutes", sa.Integer, nullable=False, server_default="0"),
        sa.Column("description", sa.Text, nullable=False, server_default=""),
    )
    op.create_index("ix_step_service_id", "service_step", ["service_id"])

    op.create_table(
        "service_price",
        sa.Column("service_id", sa.Integer, sa.ForeignKey("service.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("store_price", sa.Integer, nullable=False, server_default="0"),
        sa.Column("member_price", sa.Integer, nullable=False, server_default="0"),
        sa.Column("platinum_price", sa.Integer, nullable=False, server_default="0"),
        sa.Column("diamond_price", sa.Integer, nullable=False, server_default="0"),
        sa.Column("taste_price", sa.Integer, nullable=False, server_default="0"),
    )

    op.create_table(
        "service_package",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("service_id", sa.Integer, sa.ForeignKey("service.id", ondelete="CASCADE"), nullable=False),
        sa.Column("kind", sa.String(20), nullable=False, server_default="course5"),
        sa.Column("label", sa.String(80), nullable=False),
        sa.Column("price", sa.Integer, nullable=False, server_default="0"),
        sa.Column("times", sa.Integer, nullable=False, server_default="0"),
        sa.Column("gift_count", sa.Integer, nullable=False, server_default="0"),
        sa.Column("options_text", sa.String(255), nullable=True),
        sa.Column("sort_order", sa.Integer, nullable=False, server_default="0"),
    )
    op.create_index("ix_pkg_service_id", "service_package", ["service_id"])

    op.create_table(
        "member_tier",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(40), nullable=False, unique=True),
        sa.Column("slug", sa.String(40), nullable=False, unique=True),
        sa.Column("fee", sa.Integer, nullable=False, server_default="0"),
        sa.Column("discount_text", sa.String(40), nullable=False, server_default=""),
        sa.Column("benefits_md", sa.Text, nullable=False, server_default=""),
        sa.Column("accent_color", sa.String(20), nullable=False, server_default="#B8945A"),
        sa.Column("icon_key", sa.String(60), nullable=True),
        sa.Column("sort_order", sa.Integer, nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "store",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(80), nullable=False, unique=True),
        sa.Column("slug", sa.String(60), nullable=False, unique=True),
        sa.Column("is_flagship", sa.Boolean, nullable=False, server_default=sa.text("false")),
        sa.Column("address", sa.String(200), nullable=False, server_default=""),
        sa.Column("phone", sa.String(40), nullable=False, server_default=""),
        sa.Column("hours", sa.String(80), nullable=False, server_default="10:00 - 22:00"),
        sa.Column("intro_md", sa.Text, nullable=False, server_default=""),
        sa.Column("image_key", sa.String(255), nullable=True),
        sa.Column("gallery", sa.JSON, nullable=False, server_default=sa.text("'[]'::json")),
        sa.Column("map_url", sa.String(255), nullable=True),
        sa.Column("sort_order", sa.Integer, nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "media_asset",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("key", sa.String(255), nullable=False, unique=True),
        sa.Column("thumb_key", sa.String(255), nullable=True),
        sa.Column("mime", sa.String(60), nullable=False, server_default="image/webp"),
        sa.Column("width", sa.Integer, nullable=False, server_default="0"),
        sa.Column("height", sa.Integer, nullable=False, server_default="0"),
        sa.Column("bytes", sa.Integer, nullable=False, server_default="0"),
        sa.Column("alt", sa.String(200), nullable=False, server_default=""),
        sa.Column("tag", sa.String(60), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "admin_user",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("username", sa.String(60), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("display_name", sa.String(60), nullable=False, server_default=""),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("admin_user")
    op.drop_table("media_asset")
    op.drop_table("store")
    op.drop_table("member_tier")
    op.drop_index("ix_pkg_service_id", table_name="service_package")
    op.drop_table("service_package")
    op.drop_table("service_price")
    op.drop_index("ix_step_service_id", table_name="service_step")
    op.drop_table("service_step")
    op.drop_index("ix_service_category_id", table_name="service")
    op.drop_table("service")
    op.drop_table("category")
    op.drop_index("ix_banner_position", table_name="banner")
    op.drop_table("banner")
    op.drop_table("site_config")
