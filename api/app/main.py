from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.storage import ensure_bucket
from .routers.public import router as public_router
from .routers.auth import router as auth_router
from .routers.admin import router as admin_router

app = FastAPI(title="诗碧曼·养发会所 - Menu API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(public_router)
app.include_router(auth_router)
app.include_router(admin_router)


@app.on_event("startup")
def _startup():
    try:
        ensure_bucket()
    except Exception as e:
        print(f"[startup] ensure_bucket failed: {e}")


@app.get("/api/health")
def health():
    return {"ok": True, "name": "siyman-menu-api"}
