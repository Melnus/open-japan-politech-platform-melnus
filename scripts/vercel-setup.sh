#!/usr/bin/env bash
# =============================================================================
# OJPP Vercel 一括セットアップスクリプト
# =============================================================================
# 使い方:
#   1. Vercel CLI をインストール: npm i -g vercel
#   2. ログイン: vercel login
#   3. このスクリプトを実行: bash scripts/vercel-setup.sh
#
# やること:
#   - 8アプリ分の Vercel プロジェクトを作成 & リンク
#   - 環境変数を一括設定（DB + Supabase + Admin認証 + CORS）
#   - 全アプリをデプロイ
# =============================================================================

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

# ---------------------------------------------------------------------------
# 設定
# ---------------------------------------------------------------------------
PREFIX="ojpp"

APPS=(
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

ADMIN_APPS=(moneyglass-admin parliscope-admin)

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

is_admin_app() {
  local app="$1"
  for admin in "${ADMIN_APPS[@]}"; do
    [[ "$app" == "$admin" ]] && return 0
  done
  return 1
}

# ---------------------------------------------------------------------------
# 前提チェック
# ---------------------------------------------------------------------------
check_prerequisites() {
  echo -e "${BLUE}[1/4] 前提条件チェック...${NC}"

  if ! command -v vercel &>/dev/null; then
    echo -e "${RED}エラー: vercel CLI がインストールされていません${NC}"
    echo "  npm i -g vercel"
    exit 1
  fi

  if ! vercel whoami &>/dev/null; then
    echo -e "${RED}エラー: Vercel にログインしていません${NC}"
    echo "  vercel login"
    exit 1
  fi

  VERCEL_USER=$(vercel whoami 2>/dev/null)
  echo -e "${GREEN}  Vercel ユーザー: ${VERCEL_USER}${NC}"
  echo ""
}

# ---------------------------------------------------------------------------
# プロジェクト作成 & リンク
# ---------------------------------------------------------------------------
setup_projects() {
  echo -e "${BLUE}[2/4] Vercel プロジェクト作成 & リンク...${NC}"
  echo ""

  for app in "${APPS[@]}"; do
    local project_name="${PREFIX}-${app}"
    local app_dir="${REPO_ROOT}/apps/${app}"

    echo -e "${YELLOW}  → ${project_name}${NC} (apps/${app})"

    if [ -d "${app_dir}/.vercel" ]; then
      echo -e "${GREEN}    ✓ すでにリンク済み — スキップ${NC}"
      continue
    fi

    (
      cd "$app_dir"
      vercel link --yes --project "$project_name" 2>/dev/null || \
      vercel link --yes --project "$project_name"
    )
    echo -e "${GREEN}    ✓ リンク完了${NC}"
  done

  echo ""
}

# ---------------------------------------------------------------------------
# 環境変数設定
# ---------------------------------------------------------------------------
setup_env() {
  echo -e "${BLUE}[3/4] 環境変数設定...${NC}"
  echo ""

  # --- Supabase 接続情報 ---
  echo "━━━ Supabase Cloud 接続情報 ━━━"
  echo "(まだ Supabase プロジェクトがない場合は Ctrl+C で中断し、"
  echo " https://supabase.com/dashboard で作成してから再実行)"
  echo ""
  echo "DATABASE_URL: Supabase Dashboard → Settings → Database → Connection string → URI"
  echo "  → 'Transaction' (port 6543) を選択し、末尾に ?pgbouncer=true&connection_limit=10 を追加"
  echo "DIRECT_URL: 同ページで 'Session' (port 5432) を選択"
  echo ""

  read -rp "DATABASE_URL (pooler / port 6543): " DB_URL
  read -rp "DIRECT_URL  (direct / port 5432):  " DIRECT_URL
  read -rp "NEXT_PUBLIC_SUPABASE_URL:           " SUPABASE_URL
  read -rp "NEXT_PUBLIC_SUPABASE_ANON_KEY:      " SUPABASE_ANON_KEY
  read -rsp "SUPABASE_SERVICE_ROLE_KEY:          " SUPABASE_SERVICE_ROLE_KEY
  echo ""

  # DATABASE_URL バリデーション
  if [[ "$DB_URL" == *"127.0.0.1"* ]] || [[ "$DB_URL" == *"localhost"* ]]; then
    echo -e "${RED}警告: DATABASE_URL がローカルを指しています。本番デプロイには Supabase Cloud の URL を使用してください。${NC}"
    read -rp "このまま続行しますか？ (y/N): " db_confirm
    if [[ ! "$db_confirm" =~ ^[yY]$ ]]; then
      exit 1
    fi
  fi

  # pgbouncer パラメータチェック
  if [[ "$DB_URL" != *"pgbouncer=true"* ]] && [[ "$DB_URL" != *"localhost"* ]] && [[ "$DB_URL" != *"127.0.0.1"* ]]; then
    echo -e "${YELLOW}警告: DATABASE_URL に ?pgbouncer=true がありません。${NC}"
    echo "  Vercel サーバーレスではコネクションプーラー経由が必須です。"
    echo "  Supabase Dashboard → Settings → Database → Connection string → Transaction mode"
    read -rp "このまま続行しますか？ (y/N): " pgb_confirm
    if [[ ! "$pgb_confirm" =~ ^[yY]$ ]]; then
      exit 1
    fi
  fi

  # --- Admin 認証 ---
  echo ""
  echo "━━━ Admin アプリ認証 ━━━"
  echo "moneyglass-admin / parliscope-admin へのアクセスを Basic 認証で保護します。"
  echo ""

  read -rp  "ADMIN_USERNAME (デフォルト: admin): " ADMIN_USER
  ADMIN_USER="${ADMIN_USER:-admin}"
  read -rsp "ADMIN_PASSWORD (必須): " ADMIN_PASS
  echo ""

  if [ -z "$ADMIN_PASS" ]; then
    echo -e "${RED}エラー: ADMIN_PASSWORD は必須です。Admin アプリが無防備になります。${NC}"
    exit 1
  fi

  # --- CORS ---
  echo ""
  echo "━━━ CORS 設定（オプション）━━━"
  echo "カスタムドメインがあれば入力（カンマ区切り）。"
  echo "未入力なら *.vercel.app のみ許可。"
  read -rp "ALLOWED_ORIGINS (例: https://moneyglass.jp,https://policydiff.jp): " ALLOWED_ORIGINS
  echo ""

  # --- 各プロジェクトに設定 ---
  for app in "${APPS[@]}"; do
    local app_dir="${REPO_ROOT}/apps/${app}"

    echo -e "${YELLOW}  → ${PREFIX}-${app} に環境変数設定中...${NC}"

    (
      cd "$app_dir"

      for env_target in production preview; do
        # 全アプリ共通
        echo "$DB_URL"                    | vercel env add DATABASE_URL "$env_target" --force 2>/dev/null || true
        echo "$DIRECT_URL"                | vercel env add DIRECT_URL "$env_target" --force 2>/dev/null || true
        echo "$SUPABASE_URL"              | vercel env add NEXT_PUBLIC_SUPABASE_URL "$env_target" --force 2>/dev/null || true
        echo "$SUPABASE_ANON_KEY"         | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY "$env_target" --force 2>/dev/null || true

        # CORS（全アプリ）
        if [ -n "$ALLOWED_ORIGINS" ]; then
          echo "$ALLOWED_ORIGINS"         | vercel env add ALLOWED_ORIGINS "$env_target" --force 2>/dev/null || true
        fi

        # SERVICE_ROLE_KEY は admin アプリのみ（公開 web アプリには渡さない）
        if is_admin_app "$app"; then
          echo "$SUPABASE_SERVICE_ROLE_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY "$env_target" --force 2>/dev/null || true
          echo "$ADMIN_USER"                | vercel env add ADMIN_USERNAME "$env_target" --force 2>/dev/null || true
          echo "$ADMIN_PASS"                | vercel env add ADMIN_PASSWORD "$env_target" --force 2>/dev/null || true
        fi
      done
    )

    echo -e "${GREEN}    ✓ 完了${NC}"
  done

  echo ""
}

# ---------------------------------------------------------------------------
# デプロイ
# ---------------------------------------------------------------------------
deploy_all() {
  echo -e "${BLUE}[4/4] 全アプリを production デプロイ...${NC}"
  echo ""

  local success=0
  local fail=0

  for app in "${APPS[@]}"; do
    local project_name="${PREFIX}-${app}"
    local app_dir="${REPO_ROOT}/apps/${app}"

    echo -e "${YELLOW}  → ${project_name} をデプロイ中...${NC}"

    if (cd "$app_dir" && vercel --prod --yes 2>&1 | tail -1); then
      echo -e "${GREEN}    ✓ デプロイ成功${NC}"
      ((success++))
    else
      echo -e "${RED}    ✗ デプロイ失敗${NC}"
      ((fail++))
    fi

    echo ""
  done

  echo "==========================================="
  echo -e "${GREEN}成功: ${success}${NC} / ${RED}失敗: ${fail}${NC} / 合計: ${#APPS[@]}"
  echo "==========================================="
}

# ---------------------------------------------------------------------------
# メイン
# ---------------------------------------------------------------------------
echo ""
echo "==========================================="
echo " OJPP Vercel 一括セットアップ"
echo "==========================================="
echo ""
echo "以下の 8 アプリを Vercel にセットアップします:"
for app in "${APPS[@]}"; do
  if is_admin_app "$app"; then
    echo "  - ${PREFIX}-${app}  (🔒 Basic認証)"
  else
    echo "  - ${PREFIX}-${app}"
  fi
done
echo ""
echo "セキュリティ設定:"
echo "  ✓ Prisma directUrl (Supabase Pooler 対応)"
echo "  ✓ Admin アプリの Basic 認証"
echo "  ✓ SERVICE_ROLE_KEY は admin アプリのみに配布"
echo "  ✓ CORS オリジン制限"
echo ""
read -rp "続行しますか？ (y/N): " confirm
if [[ ! "$confirm" =~ ^[yY]$ ]]; then
  echo "中断しました。"
  exit 0
fi
echo ""

check_prerequisites
setup_projects
setup_env
deploy_all

echo ""
echo -e "${GREEN}セットアップ完了！${NC}"
echo ""
echo "次のステップ:"
echo "  1. Supabase で prisma migrate deploy を実行してスキーマ適用"
echo "     bash scripts/supabase-setup.sh"
echo "  2. Vercel ダッシュボードでカスタムドメインを設定"
echo "  3. カスタムドメイン設定後、ALLOWED_ORIGINS を更新:"
echo "     bash scripts/vercel-env.sh"
echo ""
echo "⚠️  追加セキュリティ推奨:"
echo "  - Supabase Dashboard で RLS (Row Level Security) を有効化"
echo "  - 本格運用時は Upstash Redis で分散レートリミットを導入"
echo ""
