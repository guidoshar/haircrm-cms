"""MinIO 复用 hair-crm-minio，S3 协议。"""
from __future__ import annotations

import io
import uuid
from typing import BinaryIO

import boto3
from botocore.client import Config
from PIL import Image

from .config import settings


def _client():
    return boto3.client(
        "s3",
        endpoint_url=("https://" if settings.MINIO_USE_SSL else "http://") + settings.MINIO_ENDPOINT,
        aws_access_key_id=settings.MINIO_ACCESS_KEY,
        aws_secret_access_key=settings.MINIO_SECRET_KEY,
        config=Config(signature_version="s3v4"),
        region_name="us-east-1",
    )


def ensure_bucket() -> None:
    s3 = _client()
    try:
        s3.head_bucket(Bucket=settings.MINIO_BUCKET)
    except Exception:
        try:
            s3.create_bucket(Bucket=settings.MINIO_BUCKET)
        except Exception as e:
            print(f"[storage] create_bucket warn: {e}")
    # 公开读策略
    try:
        s3.put_bucket_policy(
            Bucket=settings.MINIO_BUCKET,
            Policy='{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":"*","Action":["s3:GetObject"],"Resource":["arn:aws:s3:::'
            + settings.MINIO_BUCKET
            + '/*"]}]}',
        )
    except Exception as e:
        print(f"[storage] put_policy warn: {e}")


def public_url(key: str | None) -> str | None:
    if not key:
        return None
    return f"{settings.MINIO_PUBLIC_BASE.rstrip('/')}/{key.lstrip('/')}"


def upload_bytes(key: str, data: bytes, content_type: str) -> str:
    s3 = _client()
    s3.put_object(Bucket=settings.MINIO_BUCKET, Key=key, Body=data, ContentType=content_type)
    return key


def process_and_store_image(file_bytes: bytes, original_name: str) -> dict:
    """把上传图片转为 webp + 缩略图 webp，返回 {key, thumb_key, width, height, bytes, mime}"""
    img = Image.open(io.BytesIO(file_bytes))
    img = img.convert("RGB") if img.mode not in ("RGB", "RGBA") else img
    w, h = img.size

    base_id = uuid.uuid4().hex
    ext = "webp"
    key = f"img/{base_id}.{ext}"
    thumb_key = f"img/{base_id}_t.{ext}"

    # full webp
    out = io.BytesIO()
    img.save(out, format="WEBP", quality=88, method=6)
    full_bytes = out.getvalue()
    upload_bytes(key, full_bytes, "image/webp")

    # thumbnail (max 480px长边)
    thumb = img.copy()
    thumb.thumbnail((480, 480))
    tout = io.BytesIO()
    thumb.save(tout, format="WEBP", quality=80, method=6)
    upload_bytes(thumb_key, tout.getvalue(), "image/webp")

    return {
        "key": key,
        "thumb_key": thumb_key,
        "width": w,
        "height": h,
        "bytes": len(full_bytes),
        "mime": "image/webp",
    }


def upload_local_file(local_path: str, content_type: str = "image/webp") -> dict:
    with open(local_path, "rb") as f:
        return process_and_store_image(f.read(), local_path.split("/")[-1])
