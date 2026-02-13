#!/usr/bin/env bash
# =============================================================================
# OJPP Vercel 一括デプロイスクリプト
# =============================================================================
# 使い方:
#   bash scripts/vercel-deploy.sh              # 全アプリを production デプロイ
#   bash scripts/vercel-deploy.sh preview      # 全アプリを preview デプロイ
#   bash scripts/vercel-deploy.sh prod web     # *-web アプリだけ production
#   bash scripts/vercel-deploy.sh prod single moneyglass-web  # 1つだけ
# =============================================================================

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

PREFIX="ojpp"
MODE="${1:-prod}"          # prod or preview
FILTER="${2:-all}"         # all, web, admin, single
SINGLE_APP="${3:-}"        # FILTER=single のとき使う

ALL_APPS=(
  portal-web
  moneyglass-web
  moneyglass-admin
  policydiff-web
  parliscope-web
  parliscope-admin
  seatmap-web
  culturescope-web
  socialguard-web
)

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# フィルタリング
APPS=()
case "$FILTER" in
  all)
    APPS=("${ALL_APPS[@]}")
    ;;
  web)
    for a in "${ALL_APPS[@]}"; do
      [[ "$a" == *-web ]] && APPS+=("$a")
    done
    ;;
  admin)
    for a in "${ALL_APPS[@]}"; do
      [[ "$a" == *-admin ]] && APPS+=("$a")
    done
    ;;
  single)
    if [ -z "$SINGLE_APP" ]; then
      echo "エラー: single モードではアプリ名を指定してください"
      echo "例: bash scripts/vercel-deploy.sh prod single moneyglass-web"
      exit 1
    fi
    APPS=("$SINGLE_APP")
    ;;
  *)
    echo "エラー: 不明なフィルタ '$FILTER' (all/web/admin/single)"
    exit 1
    ;;
esac

PROD_FLAG=""
if [ "$MODE" = "prod" ]; then
  PROD_FLAG="--prod"
fi

echo ""
echo -e "${BLUE}OJPP Vercel デプロイ (${MODE}) — ${#APPS[@]} アプリ${NC}"
echo ""

success=0
fail=0
urls=()

for app in "${APPS[@]}"; do
  app_dir="${REPO_ROOT}/apps/${app}"

  if [ ! -d "${app_dir}/.vercel" ]; then
    echo -e "${RED}  ✗ ${app}: リンクされていません（先に vercel-setup.sh を実行）${NC}"
    ((fail++))
    continue
  fi

  echo -e "${YELLOW}  → ${PREFIX}-${app} デプロイ中...${NC}"

  url=$(cd "$app_dir" && vercel $PROD_FLAG --yes 2>&1 | tail -1) || true

  if [[ "$url" == http* ]]; then
    echo -e "${GREEN}    ✓ ${url}${NC}"
    urls+=("${app}: ${url}")
    ((success++))
  else
    echo -e "${RED}    ✗ デプロイ失敗${NC}"
    ((fail++))
  fi
done

echo ""
echo "==========================================="
echo -e " ${GREEN}成功: ${success}${NC} / ${RED}失敗: ${fail}${NC} / 合計: ${#APPS[@]}"
echo "==========================================="
echo ""

if [ ${#urls[@]} -gt 0 ]; then
  echo "デプロイ URL:"
  for u in "${urls[@]}"; do
    echo "  $u"
  done
  echo ""
fi
