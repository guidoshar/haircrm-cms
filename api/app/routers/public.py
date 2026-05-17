from fastapi import APIRouter, Depends, Response, Query
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from ..deps import get_db
from ..core.storage import public_url
from ..models import (
    SiteConfig,
    Banner,
    Category,
    Service,
    MemberTier,
    Store,
)
from ..schemas.site import SiteConfigOut, BannerOut
from ..schemas.service import (
    CategoryWithServices,
    ServiceFullOut,
    PriceOut,
    StepOut,
    PackageOut,
)
from ..schemas.tier import TierOut
from ..schemas.store import StoreOut

router = APIRouter(prefix="/api", tags=["public"])

CACHE_HEADER = "public, max-age=60, s-maxage=300"


def _service_to_full(s: Service) -> ServiceFullOut:
    return ServiceFullOut(
        id=s.id,
        category_id=s.category_id,
        name=s.name,
        slug=s.slug,
        summary=s.summary,
        time_min=s.time_min,
        cover_image_key=s.cover_image_key,
        cover_image_url=public_url(s.cover_image_key),
        sort_order=s.sort_order,
        is_active=s.is_active,
        price=PriceOut.model_validate(s.price) if s.price else None,
        principle_md=s.principle_md or "",
        value_md=s.value_md or "",
        products_md=s.products_md or "",
        gallery=s.gallery or [],
        gallery_urls=[public_url(k) or "" for k in (s.gallery or [])],
        steps=[StepOut.model_validate(st) for st in s.steps],
        packages=[PackageOut.model_validate(p) for p in s.packages],
    )


@router.get("/site", response_model=SiteConfigOut)
def get_site(response: Response, db: Session = Depends(get_db)):
    response.headers["Cache-Control"] = CACHE_HEADER
    cfg = db.query(SiteConfig).first()
    if not cfg:
        cfg = SiteConfig()
        db.add(cfg)
        db.commit()
        db.refresh(cfg)
    return cfg


@router.get("/menu", response_model=list[CategoryWithServices])
def get_menu(response: Response, db: Session = Depends(get_db)):
    response.headers["Cache-Control"] = CACHE_HEADER
    stmt = (
        select(Category)
        .options(
            selectinload(Category.services).selectinload(Service.steps),
            selectinload(Category.services).selectinload(Service.price),
            selectinload(Category.services).selectinload(Service.packages),
        )
        .order_by(Category.sort_order)
    )
    cats = db.scalars(stmt).all()
    out: list[CategoryWithServices] = []
    for c in cats:
        out.append(
            CategoryWithServices(
                id=c.id,
                name=c.name,
                slug=c.slug,
                sort_order=c.sort_order,
                icon_key=c.icon_key,
                hero_image_key=c.hero_image_key,
                hero_image_url=public_url(c.hero_image_key),
                accent_color=c.accent_color,
                tagline=c.tagline,
                services=[_service_to_full(s) for s in c.services if s.is_active],
            )
        )
    return out


@router.get("/tiers", response_model=list[TierOut])
def get_tiers(response: Response, db: Session = Depends(get_db)):
    response.headers["Cache-Control"] = CACHE_HEADER
    rows = db.query(MemberTier).filter(MemberTier.is_active == True).order_by(MemberTier.sort_order).all()  # noqa: E712
    return rows


@router.get("/stores", response_model=list[StoreOut])
def get_stores(response: Response, db: Session = Depends(get_db)):
    response.headers["Cache-Control"] = CACHE_HEADER
    rows = db.query(Store).filter(Store.is_active == True).order_by(Store.sort_order).all()  # noqa: E712
    out = []
    for s in rows:
        d = StoreOut.model_validate(s).model_dump()
        d["image_url"] = public_url(s.image_key)
        d["gallery_urls"] = [public_url(k) or "" for k in (s.gallery or [])]
        out.append(d)
    return out


@router.get("/banners", response_model=list[BannerOut])
def get_banners(
    response: Response,
    position: str = Query("home"),
    db: Session = Depends(get_db),
):
    response.headers["Cache-Control"] = CACHE_HEADER
    rows = (
        db.query(Banner)
        .filter(Banner.is_active == True, Banner.position == position)  # noqa: E712
        .order_by(Banner.sort_order)
        .all()
    )
    out = []
    for b in rows:
        d = BannerOut.model_validate(b).model_dump()
        d["image_url"] = public_url(b.image_key)
        out.append(d)
    return out
