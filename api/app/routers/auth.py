from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..deps import get_db, get_current_admin
from ..core.security import verify_password, create_access_token, hash_password
from ..models import AdminUser
from ..schemas.auth import LoginIn, TokenOut, ChangePasswordIn

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=TokenOut)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = (
        db.query(AdminUser)
        .filter(AdminUser.username == payload.username, AdminUser.is_active == True)  # noqa: E712
        .first()
    )
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="账号或密码错误")
    token = create_access_token(user.username, extra={"uid": user.id})
    return TokenOut(
        access_token=token,
        user={"id": user.id, "username": user.username, "display_name": user.display_name},
    )


@router.get("/me")
def me(current: AdminUser = Depends(get_current_admin)):
    return {
        "id": current.id,
        "username": current.username,
        "display_name": current.display_name,
    }


@router.post("/change-password")
def change_password(
    payload: ChangePasswordIn,
    current: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    if not verify_password(payload.old_password, current.password_hash):
        raise HTTPException(status_code=400, detail="原密码错误")
    if len(payload.new_password) < 6:
        raise HTTPException(status_code=400, detail="新密码至少 6 位")
    current.password_hash = hash_password(payload.new_password)
    db.commit()
    return {"ok": True}
