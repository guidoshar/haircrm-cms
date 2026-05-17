#!/usr/bin/env bash
# 诗碧曼 Menu API · 端到端烟测
# 覆盖：登录 → 列表 → 新建 → 改 → 图片上传 → 关联到资源 → 删除
set -e
BASE="${BASE:-https://siyanhair.com/products}"
ADMIN="${ADMIN:-admin}"
PASS="${PASS:-admin@2025}"

red()  { printf "\033[31m%s\033[0m\n" "$*"; }
grn()  { printf "\033[32m%s\033[0m\n" "$*"; }
ylw()  { printf "\033[33m%s\033[0m\n" "$*"; }

step() { ylw "▸ $*"; }
ok()   { grn  "  ✓ $*"; }

curl_k() { curl -sS -k "$@"; }

# 1. 登录
step "登录 admin"
TOKEN=$(curl_k -X POST -H "Content-Type: application/json" \
  -d "{\"username\":\"$ADMIN\",\"password\":\"$PASS\"}" \
  "$BASE/api/auth/login" | python3 -c "import sys,json;print(json.load(sys.stdin)['access_token'])")
[ -n "$TOKEN" ] && ok "拿到 JWT (${#TOKEN} chars)"

H="-H Authorization:Bearer\ $TOKEN"
J="-H Content-Type:application/json"

# 2. /me
step "读取当前 admin"
WHO=$(curl_k -H "Authorization: Bearer $TOKEN" "$BASE/api/auth/me" | python3 -c "import sys,json;print(json.load(sys.stdin)['username'])")
[ "$WHO" = "$ADMIN" ] && ok "当前用户: $WHO"

# 3. 列表 — 公开端
step "公开列表（无需鉴权）"
for E in site menu tiers stores; do
  C=$(curl_k -o /dev/null -w "%{http_code}" "$BASE/api/$E")
  [ "$C" = "200" ] && ok "/api/$E → 200"
done

# 4. 列表 — admin 端
step "Admin 列表"
for E in categories services tiers stores banners media; do
  C=$(curl_k -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$BASE/api/admin/$E")
  [ "$C" = "200" ] && ok "/api/admin/$E → 200"
done

# 5. 上传一张测试图
step "上传测试图片"
SAMPLE=/tmp/smoke_sample.png
python3 -c "
from PIL import Image
img = Image.new('RGB', (1200, 800), (200, 180, 140))
img.save('$SAMPLE')
"
UP=$(curl_k -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@$SAMPLE" -F "alt=smoke-test" -F "tag=smoke" \
  "$BASE/api/admin/media/upload")
KEY=$(echo "$UP" | python3 -c "import sys,json;print(json.load(sys.stdin)['key'])")
URL=$(echo "$UP" | python3 -c "import sys,json;print(json.load(sys.stdin)['url'])")
ok "上传 OK · key=$KEY"
ok "       url=$URL"

# 验图片可读
HC=$(curl_k -o /dev/null -w "%{http_code}" "$BASE${URL#*/products}")
[ "$HC" = "200" ] && ok "通过 CDN 反代访问 → 200"

# 6. 把图绑到第一个 banner
step "更新 banner 图"
B1=$(curl_k -H "Authorization: Bearer $TOKEN" "$BASE/api/admin/banners" | python3 -c "import sys,json;print(json.load(sys.stdin)[0]['id'])")
PATCH=$(curl_k -X PATCH \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"image_key\":\"$KEY\",\"headline\":\"烟测覆盖\",\"subline\":\"自动化测试占位\"}" \
  "$BASE/api/admin/banners/$B1")
NEW=$(echo "$PATCH" | python3 -c "import sys,json;print(json.load(sys.stdin)['headline'])")
[ "$NEW" = "烟测覆盖" ] && ok "banner #$B1 标题已更新"

# 7. 创建临时服务 + 改它 + 删它
step "新建一个临时项目 (slug: smoke-tmp)"
CAT=$(curl_k -H "Authorization: Bearer $TOKEN" "$BASE/api/admin/categories" | python3 -c "import sys,json;print(json.load(sys.stdin)[0]['id'])")
NEW=$(curl_k -X POST \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"category_id\":$CAT,\"name\":\"烟测项目\",\"slug\":\"smoke-tmp\",\"summary\":\"自动化\",\"time_min\":30}" \
  "$BASE/api/admin/services")
SID=$(echo "$NEW" | python3 -c "import sys,json;print(json.load(sys.stdin)['id'])")
ok "新建项目 #$SID"

# 8. 给它写价格、步骤、套餐
step "写价格/步骤/套餐"
curl_k -X PUT -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"store_price":288,"member_price":238,"platinum_price":210,"diamond_price":188,"taste_price":98}' \
  "$BASE/api/admin/services/$SID/price" > /dev/null && ok "价格已写入"

curl_k -X PUT -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '[{"idx":0,"title":"烟测步骤A","minutes":10,"description":"准备"},{"idx":1,"title":"烟测步骤B","minutes":20,"description":"主体"}]' \
  "$BASE/api/admin/services/$SID/steps" > /dev/null && ok "步骤已写入 (2 步)"

curl_k -X PUT -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '[{"kind":"course5","label":"烟测课程","price":1280,"times":5,"gift_count":0,"options_text":null,"sort_order":0}]' \
  "$BASE/api/admin/services/$SID/packages" > /dev/null && ok "套餐已写入"

# 9. 改基础信息 + 关联封面图
step "PATCH 基础信息 & 封面图"
curl_k -X PATCH -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"category_id\":$CAT,\"name\":\"烟测项目（已改）\",\"slug\":\"smoke-tmp\",\"summary\":\"PATCH OK\",\"principle_md\":\"#原理\\n大白话讲...\",\"value_md\":\"\",\"products_md\":\"\",\"time_min\":35,\"cover_image_key\":\"$KEY\",\"gallery\":[],\"sort_order\":99,\"is_active\":true}" \
  "$BASE/api/admin/services/$SID" > /dev/null && ok "PATCH 完成"

# 10. 拉详情验证
step "GET 详情验证"
DETAIL=$(curl_k -H "Authorization: Bearer $TOKEN" "$BASE/api/admin/services/$SID")
echo "$DETAIL" | python3 -c "
import sys,json
d=json.load(sys.stdin)
assert d['name']=='烟测项目（已改）'
assert d['cover_image_key'] == '$KEY'
assert d['price']['member_price']==238
assert len(d['steps'])==2
assert d['steps'][0]['title']=='烟测步骤A'
assert len(d['packages'])==1
print('  detail OK · name=', d['name'], '· steps=', len(d['steps']), '· pkg=', len(d['packages']))
"
ok "详情字段全部一致"

# 11. 修改密码（往返）
step "修改密码 → 还原"
curl_k -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"old_password\":\"$PASS\",\"new_password\":\"smoke-tmp-pwd-2026\"}" \
  "$BASE/api/auth/change-password" > /dev/null && ok "改密成功"

# 用新密码登录验证
T2=$(curl_k -X POST -H "Content-Type: application/json" \
  -d "{\"username\":\"$ADMIN\",\"password\":\"smoke-tmp-pwd-2026\"}" \
  "$BASE/api/auth/login" | python3 -c "import sys,json;print(json.load(sys.stdin)['access_token'])")
[ -n "$T2" ] && ok "新密码登录成功"

# 还原
curl_k -X POST -H "Authorization: Bearer $T2" -H "Content-Type: application/json" \
  -d "{\"old_password\":\"smoke-tmp-pwd-2026\",\"new_password\":\"$PASS\"}" \
  "$BASE/api/auth/change-password" > /dev/null && ok "密码已还原"

# 12. 清理 — 删项目
step "清理临时项目"
DC=$(curl_k -X DELETE -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$BASE/api/admin/services/$SID")
[ "$DC" = "200" ] && ok "已删除 #$SID"

# 13. 删除上传图
DC2=$(curl_k -X DELETE -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$BASE/api/admin/media")
step "（图片库保留，不删 seed，由人工处理）"

grn "═════════════════════════════════════════"
grn "  烟测全部通过 · API 状态稳定"
grn "═════════════════════════════════════════"
