from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select

from ..deps import get_db, get_current_admin
from ..core.storage import process_and_store_image, public_url
from ..models import (
    SiteConfig,
    Banner,
    Category,
    Service,
    ServiceStep,
    ServicePrice,
    ServicePackage,
    MemberTier,
    Store,
    MediaAsset,
    AdminUser,
)
from ..schemas.site import SiteConfigOut, SiteConfigUpdate, BannerOut, BannerCreate, BannerUpdate
from ..schemas.service import (
    CategoryOut,
    CategoryIn,
    ServiceListOut,
    ServiceFullOut,
    ServiceIn,
    PriceIn,
    PriceOut,
    StepIn,
    StepOut,
    PackageIn,
    PackageOut,
)
from ..schemas.tier import TierOut, TierIn
from ..schemas.store import StoreOut, StoreIn
from ..schemas.media import MediaOut, MediaUpdate
from ..routers.public import _service_to_full

router = APIRouter(prefix="/api/admin", tags=["admin"], dependencies=[Depends(get_current_admin)])


# ---------- Site ----------
@router.get("/site", response_model=SiteConfigOut)
def get_site(db: Session = Depends(get_db)):
    cfg = db.query(SiteConfig).first()
    if not cfg:
        cfg = SiteConfig()
        db.add(cfg)
        db.commit()
        db.refresh(cfg)
    return cfg


@router.patch("/site", response_model=SiteConfigOut)
def update_site(payload: SiteConfigUpdate, db: Session = Depends(get_db)):
    cfg = db.query(SiteConfig).first()
    if not cfg:
        cfg = SiteConfig()
        db.add(cfg)
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(cfg, k, v)
    db.commit()
    db.refresh(cfg)
    return cfg


# ---------- Banner ----------
def _banner_out(b: Banner) -> dict:
    d = BannerOut.model_validate(b).model_dump()
    d["image_url"] = public_url(b.image_key)
    return d


@router.get("/banners")
def list_banners(db: Session = Depends(get_db)):
    rows = db.query(Banner).order_by(Banner.position, Banner.sort_order).all()
    return [_banner_out(b) for b in rows]


@router.post("/banners")
def create_banner(payload: BannerCreate, db: Session = Depends(get_db)):
    b = Banner(**payload.model_dump())
    db.add(b)
    db.commit()
    db.refresh(b)
    return _banner_out(b)


@router.patch("/banners/{bid}")
def update_banner(bid: int, payload: BannerUpdate, db: Session = Depends(get_db)):
    b = db.get(Banner, bid)
    if not b:
        raise HTTPException(404, "未找到")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(b, k, v)
    db.commit()
    db.refresh(b)
    return _banner_out(b)


@router.delete("/banners/{bid}")
def delete_banner(bid: int, db: Session = Depends(get_db)):
    b = db.get(Banner, bid)
    if not b:
        raise HTTPException(404, "未找到")
    db.delete(b)
    db.commit()
    return {"ok": True}


# ---------- Categories ----------
def _category_out(c: Category) -> dict:
    d = CategoryOut.model_validate(c).model_dump()
    d["hero_image_url"] = public_url(c.hero_image_key)
    return d


@router.get("/categories")
def list_categories(db: Session = Depends(get_db)):
    rows = db.query(Category).order_by(Category.sort_order).all()
    return [_category_out(c) for c in rows]


@router.post("/categories")
def create_category(payload: CategoryIn, db: Session = Depends(get_db)):
    if db.query(Category).filter(Category.slug == payload.slug).first():
        raise HTTPException(400, "slug 已存在")
    c = Category(**payload.model_dump())
    db.add(c)
    db.commit()
    db.refresh(c)
    return _category_out(c)


@router.patch("/categories/{cid}")
def update_category(cid: int, payload: CategoryIn, db: Session = Depends(get_db)):
    c = db.get(Category, cid)
    if not c:
        raise HTTPException(404, "未找到")
    for k, v in payload.model_dump().items():
        setattr(c, k, v)
    db.commit()
    db.refresh(c)
    return _category_out(c)


@router.delete("/categories/{cid}")
def delete_category(cid: int, db: Session = Depends(get_db)):
    c = db.get(Category, cid)
    if not c:
        raise HTTPException(404, "未找到")
    db.delete(c)
    db.commit()
    return {"ok": True}


# ---------- Services ----------
@router.get("/services")
def list_services(db: Session = Depends(get_db), category_id: Optional[int] = None):
    q = db.query(Service)
    if category_id:
        q = q.filter(Service.category_id == category_id)
    rows = q.order_by(Service.category_id, Service.sort_order).all()
    return [
        {
            **ServiceListOut.model_validate(s).model_dump(),
            "cover_image_url": public_url(s.cover_image_key),
        }
        for s in rows
    ]


@router.get("/services/{sid}")
def get_service(sid: int, db: Session = Depends(get_db)):
    s = db.scalars(
        select(Service)
        .where(Service.id == sid)
        .options(selectinload(Service.steps), selectinload(Service.price), selectinload(Service.packages))
    ).first()
    if not s:
        raise HTTPException(404, "未找到")
    return _service_to_full(s).model_dump()


@router.post("/services")
def create_service(payload: ServiceIn, db: Session = Depends(get_db)):
    if db.query(Service).filter(Service.slug == payload.slug).first():
        raise HTTPException(400, "slug 已存在")
    s = Service(**payload.model_dump())
    db.add(s)
    db.flush()
    db.add(ServicePrice(service_id=s.id))
    db.commit()
    db.refresh(s)
    return _service_to_full(s).model_dump()


@router.patch("/services/{sid}")
def update_service(sid: int, payload: ServiceIn, db: Session = Depends(get_db)):
    s = db.get(Service, sid)
    if not s:
        raise HTTPException(404, "未找到")
    for k, v in payload.model_dump().items():
        setattr(s, k, v)
    db.commit()
    db.refresh(s)
    return get_service(sid, db)


@router.delete("/services/{sid}")
def delete_service(sid: int, db: Session = Depends(get_db)):
    s = db.get(Service, sid)
    if not s:
        raise HTTPException(404, "未找到")
    db.delete(s)
    db.commit()
    return {"ok": True}


@router.put("/services/{sid}/price", response_model=PriceOut)
def upsert_price(sid: int, payload: PriceIn, db: Session = Depends(get_db)):
    s = db.get(Service, sid)
    if not s:
        raise HTTPException(404, "未找到")
    p = db.get(ServicePrice, sid)
    if not p:
        p = ServicePrice(service_id=sid)
        db.add(p)
    for k, v in payload.model_dump().items():
        setattr(p, k, v)
    db.commit()
    db.refresh(p)
    return p


@router.put("/services/{sid}/steps", response_model=List[StepOut])
def replace_steps(sid: int, payload: List[StepIn], db: Session = Depends(get_db)):
    s = db.get(Service, sid)
    if not s:
        raise HTTPException(404, "未找到")
    db.query(ServiceStep).filter(ServiceStep.service_id == sid).delete()
    for st in payload:
        db.add(ServiceStep(service_id=sid, **st.model_dump()))
    db.commit()
    rows = db.query(ServiceStep).filter(ServiceStep.service_id == sid).order_by(ServiceStep.idx).all()
    return rows


@router.put("/services/{sid}/packages", response_model=List[PackageOut])
def replace_packages(sid: int, payload: List[PackageIn], db: Session = Depends(get_db)):
    s = db.get(Service, sid)
    if not s:
        raise HTTPException(404, "未找到")
    db.query(ServicePackage).filter(ServicePackage.service_id == sid).delete()
    for p in payload:
        db.add(ServicePackage(service_id=sid, **p.model_dump()))
    db.commit()
    rows = db.query(ServicePackage).filter(ServicePackage.service_id == sid).order_by(ServicePackage.sort_order).all()
    return rows


# ---------- Tiers ----------
@router.get("/tiers", response_model=list[TierOut])
def list_tiers(db: Session = Depends(get_db)):
    return db.query(MemberTier).order_by(MemberTier.sort_order).all()


@router.post("/tiers", response_model=TierOut)
def create_tier(payload: TierIn, db: Session = Depends(get_db)):
    if db.query(MemberTier).filter(MemberTier.slug == payload.slug).first():
        raise HTTPException(400, "slug 已存在")
    t = MemberTier(**payload.model_dump())
    db.add(t)
    db.commit()
    db.refresh(t)
    return t


@router.patch("/tiers/{tid}", response_model=TierOut)
def update_tier(tid: int, payload: TierIn, db: Session = Depends(get_db)):
    t = db.get(MemberTier, tid)
    if not t:
        raise HTTPException(404, "未找到")
    for k, v in payload.model_dump().items():
        setattr(t, k, v)
    db.commit()
    db.refresh(t)
    return t


@router.delete("/tiers/{tid}")
def delete_tier(tid: int, db: Session = Depends(get_db)):
    t = db.get(MemberTier, tid)
    if not t:
        raise HTTPException(404, "未找到")
    db.delete(t)
    db.commit()
    return {"ok": True}


# ---------- Stores ----------
def _store_out(s: Store) -> dict:
    d = StoreOut.model_validate(s).model_dump()
    d["image_url"] = public_url(s.image_key)
    d["gallery_urls"] = [public_url(k) or "" for k in (s.gallery or [])]
    return d


@router.get("/stores")
def list_stores(db: Session = Depends(get_db)):
    rows = db.query(Store).order_by(Store.sort_order).all()
    return [_store_out(s) for s in rows]


@router.post("/stores")
def create_store(payload: StoreIn, db: Session = Depends(get_db)):
    if db.query(Store).filter(Store.slug == payload.slug).first():
        raise HTTPException(400, "slug 已存在")
    s = Store(**payload.model_dump())
    db.add(s)
    db.commit()
    db.refresh(s)
    return _store_out(s)


@router.patch("/stores/{sid}")
def update_store(sid: int, payload: StoreIn, db: Session = Depends(get_db)):
    s = db.get(Store, sid)
    if not s:
        raise HTTPException(404, "未找到")
    for k, v in payload.model_dump().items():
        setattr(s, k, v)
    db.commit()
    db.refresh(s)
    return _store_out(s)


@router.delete("/stores/{sid}")
def delete_store(sid: int, db: Session = Depends(get_db)):
    s = db.get(Store, sid)
    if not s:
        raise HTTPException(404, "未找到")
    db.delete(s)
    db.commit()
    return {"ok": True}


# ---------- Reorder ----------
@router.post("/reorder")
def reorder(
    entity: str = Query(..., description="category/service/banner/tier/store/package"),
    ids: List[int] = Query(...),
    db: Session = Depends(get_db),
):
    mapping = {
        "category": Category,
        "service": Service,
        "banner": Banner,
        "tier": MemberTier,
        "store": Store,
        "package": ServicePackage,
    }
    Model = mapping.get(entity)
    if not Model:
        raise HTTPException(400, "不支持的资源")
    for idx, oid in enumerate(ids):
        obj = db.get(Model, oid)
        if obj:
            obj.sort_order = idx
    db.commit()
    return {"ok": True}


# ---------- Media ----------
def _media_out(m: MediaAsset) -> dict:
    d = MediaOut.model_validate(m).model_dump()
    d["url"] = public_url(m.key)
    d["thumb_url"] = public_url(m.thumb_key) if m.thumb_key else d["url"]
    return d


@router.get("/media")
def list_media(db: Session = Depends(get_db), tag: Optional[str] = None):
    q = db.query(MediaAsset)
    if tag:
        q = q.filter(MediaAsset.tag == tag)
    rows = q.order_by(MediaAsset.id.desc()).all()
    return [_media_out(m) for m in rows]


@router.post("/media/upload")
def upload_media(
    file: UploadFile = File(...),
    alt: str = Form(""),
    tag: Optional[str] = Form(None),
    db: Session = Depends(get_db),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400, "仅支持图片")
    raw = file.file.read()
    if len(raw) > 20 * 1024 * 1024:
        raise HTTPException(400, "图片超过 20MB")
    info = process_and_store_image(raw, file.filename or "upload")
    m = MediaAsset(
        key=info["key"],
        thumb_key=info["thumb_key"],
        mime=info["mime"],
        width=info["width"],
        height=info["height"],
        bytes=info["bytes"],
        alt=alt,
        tag=tag,
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return _media_out(m)


@router.patch("/media/{mid}")
def update_media(mid: int, payload: MediaUpdate, db: Session = Depends(get_db)):
    m = db.get(MediaAsset, mid)
    if not m:
        raise HTTPException(404, "未找到")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(m, k, v)
    db.commit()
    db.refresh(m)
    return _media_out(m)


@router.delete("/media/{mid}")
def delete_media(mid: int, db: Session = Depends(get_db)):
    m = db.get(MediaAsset, mid)
    if not m:
        raise HTTPException(404, "未找到")
    db.delete(m)
    db.commit()
    return {"ok": True}
