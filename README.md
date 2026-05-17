# 诗碧曼 · 价目与会员展示站（siyman-menu）

> 高端养发馆的「价目 + 会员 + 服务介绍」公开展示页 + 简易 CMS。
> 部署在 `https://siyanhair.com/products/`，pad 端优先优化。

## 技术栈

| 层 | 选型 |
|---|---|
| 前端 | Vite + React 19 + TypeScript + Tailwind 4 + Fluent UI 2 + Framer Motion |
| 后端 | FastAPI + SQLAlchemy 2 + Alembic + psycopg |
| DB  | PostgreSQL 16 |
| 对象存储 | MinIO（复用 `hair-crm-minio`） |
| 反代 | 复用 `hair-crm-nginx` |
| 字体 | LXGW WenKai · Noto Serif SC · Inter |

## 目录结构

```
siyman-menu/
├── api/                  # FastAPI 后端
│   ├── app/
│   │   ├── core/         # 配置 / JWT / 存储
│   │   ├── models/       # SQLAlchemy 模型
│   │   ├── schemas/      # Pydantic 模型
│   │   ├── routers/      # public · auth · admin
│   │   ├── seed.py       # Excel → DB
│   │   └── main.py
│   ├── alembic/          # 迁移
│   ├── tests/smoke.sh    # 端到端烟测
│   └── Dockerfile
├── web/                  # React 前端
│   ├── src/
│   │   ├── components/   # PublicLayout 等
│   │   ├── pages/        # Home / Membership / Stores ...
│   │   ├── admin/        # CMS 全套
│   │   ├── lib/api.ts    # 封装 fetch
│   │   ├── theme.ts      # Fluent brand token
│   │   └── styles.css    # Tailwind + 字体
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
```

## 跑起来（本机）

```bash
cp .env.example .env  # 改 DB 密码、JWT secret、MinIO 密钥
cd web && npm i && npm run build && cd ..
docker compose up -d --build
docker compose exec siyman-api alembic upgrade head
docker compose exec siyman-api python -m app.seed   # 灌入 Excel 初值
```

## 路由

| 路径 | 说明 |
|---|---|
| `/products/`           | 公开展示首页 |
| `/products/menu`       | 项目分类总览 |
| `/products/services/:slug` | 单项目详情 |
| `/products/members`    | 会员等级 |
| `/products/stores`     | 门店 |
| `/products/about`      | 品牌理念 |
| `/products/admin`      | CMS 入口（admin / admin@2025） |
| `/products/api/...`    | 后端 |
| `/products/cdn/...`    | 图片 |

## 烟测

```bash
bash api/tests/smoke.sh
```

覆盖：登录 / 列表 / 上传图片 / 关联到资源 / CRUD / 改密往返 / 详情字段一致性。

## 升级思路

- 颜色：杉叶青 + 珍珠白为主，金不再是主角
- 字体：标题切 Noto Serif SC（细而清），仅在重点 slogan 处用 LXGW WenKai
- 卡片：图片 + 渐变蒙层，「→ 进入」轻重号 CTA
- 渐变文字：在「祝您今天过得愉快」这种点睛处用青→金的 mask
- 全栈 token 化：Tailwind/Fluent brand 共一份色板
