FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt

COPY . /app

EXPOSE 8088

CMD ["bash", "-lc", "alembic upgrade head && python -m app.seed && uvicorn app.main:app --host 0.0.0.0 --port 8088"]
