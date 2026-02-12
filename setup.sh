#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
#  Open Japan PoliTech Platform — ワンクリックセットアップ
#
#  git clone https://github.com/ochyai/open-japan-politech-platform.git
#  cd open-japan-politech-platform && bash setup.sh
# =============================================================================

# -- Colors -------------------------------------------------------------------
R='\033[0m'        # Reset
B='\033[1m'        # Bold
D='\033[2m'        # Dim
RED='\033[0;31m'
GRN='\033[0;32m'
YEL='\033[1;33m'
BLU='\033[0;34m'
MAG='\033[0;35m'
CYN='\033[0;36m'
WHT='\033[1;37m'
BGGRN='\033[42m'
BGBLU='\033[44m'
BGMAG='\033[45m'
CLR='\033[K'       # Clear to end of line

# -- State --------------------------------------------------------------------
LOG="/tmp/ojpp-setup-$(date +%Y%m%d-%H%M%S).log"
SKIP_DOCKER=false
DEV_PID=""
COMPOSE=""
TOTAL_START=$SECONDS

# -- Helpers ------------------------------------------------------------------
line()  { echo -e "  ${D}│${R}"; }
msg()   { echo -e "  ${D}│${R}  $*"; }
ok()    { echo -e "  ${D}│${R}  ${GRN}✔${R} $*${CLR}"; }
wrn()   { echo -e "  ${D}│${R}  ${YEL}⚠${R}  $*${CLR}"; }
err()   { echo -e "  ${D}│${R}  ${RED}✖${R} $*${CLR}"; }
head()  { echo -e "\n  ${CYN}◇${R}  ${B}$*${R}"; }

die() {
  err "$1"
  line
  msg "${D}ログ: ${LOG}${R}"
  echo -e "  ${D}└${R}"
  echo ""
  exit 1
}

# Run a command quietly with spinner-like progress indicator
run() {
  local label="$1"; shift
  echo -ne "  ${D}│${R}  ${CYN}◌${R} ${label}...${CLR}\r"
  local t=$SECONDS
  if "$@" >> "$LOG" 2>&1; then
    local dt=$((SECONDS - t))
    local ts=""
    [ "$dt" -gt 2 ] && ts=" ${D}(${dt}s)${R}"
    echo -e "  ${D}│${R}  ${GRN}✔${R} ${label}${ts}${CLR}"
    return 0
  else
    echo -e "  ${D}│${R}  ${RED}✖${R} ${label}${CLR}"
    return 1
  fi
}

port_in_use() {
  (echo >/dev/tcp/localhost/"$1") 2>/dev/null
}

# =============================================================================
#  Banner
# =============================================================================
echo ""
echo ""
echo -e "  ${CYN}◆${R}  ${B}Open Japan PoliTech Platform${R} ${D}v0.1${R}"
echo -e "  ${D}│${R}"
echo -e "  ${D}│${R}  🏛️  AIエージェント時代の政治インフラ"
echo -e "  ${D}│${R}  ${D}政党にも企業にもよらない、完全オープンな政治テクノロジー基盤${R}"
echo -e "  ${D}│${R}  ${D}MoneyGlass · PolicyDiff · ParliScope — 15政党対応${R}"

# Sanity check
grep -q "open-japan-politech-platform" package.json 2>/dev/null \
  || die "open-japan-politech-platform ディレクトリで実行してください"

# =============================================================================
#  環境チェック
# =============================================================================
head "環境チェック"

# -- Docker ---
command -v docker &>/dev/null \
  || die "Docker が必要です\n\n     macOS:   ${CYN}brew install --cask docker${R}\n     Linux:   ${CYN}https://docs.docker.com/engine/install/${R}"

docker info >> "$LOG" 2>&1 \
  || die "Docker が起動していません → ${B}Docker Desktop を起動${R}してから再実行してください"

COMPOSE="docker compose"
if ! $COMPOSE version >> "$LOG" 2>&1; then
  if command -v docker-compose &>/dev/null; then
    COMPOSE="docker-compose"
  else
    die "docker compose が見つかりません"
  fi
fi
ok "Docker $(docker --version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)"

# -- Node.js ---
install_node() {
  if command -v fnm &>/dev/null; then
    fnm install 22 >> "$LOG" 2>&1 && eval "$(fnm env)" && fnm use 22 >> "$LOG" 2>&1
  elif [ -s "$HOME/.nvm/nvm.sh" ]; then
    # shellcheck source=/dev/null
    . "$HOME/.nvm/nvm.sh"
    nvm install 22 >> "$LOG" 2>&1 && nvm use 22 >> "$LOG" 2>&1
  elif command -v mise &>/dev/null; then
    mise install node@22 >> "$LOG" 2>&1 && eval "$(mise activate bash)" && mise use --env local node@22 >> "$LOG" 2>&1
  else
    echo -ne "  ${D}│${R}  ${CYN}◌${R} fnm (Node バージョン管理) をインストール中...${CLR}\r"
    curl -fsSL https://fnm.vercel.app/install 2>/dev/null | bash -s -- --skip-shell >> "$LOG" 2>&1
    FNM_DIR="${FNM_DIR:-$HOME/.local/share/fnm}"
    [ -d "$FNM_DIR" ] || FNM_DIR="$HOME/.fnm"
    export PATH="$FNM_DIR:$PATH"
    eval "$(fnm env 2>/dev/null)" || eval "$("$FNM_DIR/fnm" env 2>/dev/null)"
    echo -e "  ${D}│${R}  ${GRN}✔${R} fnm インストール完了${CLR}"
    echo -ne "  ${D}│${R}  ${CYN}◌${R} Node.js 22 をインストール中...${CLR}\r"
    fnm install 22 >> "$LOG" 2>&1 && fnm use 22 >> "$LOG" 2>&1
    echo -e "  ${D}│${R}  ${GRN}✔${R} Node.js $(node -v) インストール完了${CLR}"
  fi
}

if command -v node &>/dev/null; then
  NODE_MAJOR=$(node -v | sed 's/v//' | cut -d. -f1)
  if [ "$NODE_MAJOR" -ge 22 ]; then
    ok "Node.js $(node -v)"
  else
    wrn "Node.js $(node -v) → v22+ が必要"
    install_node
  fi
else
  install_node
fi

# -- pnpm ---
if ! command -v pnpm &>/dev/null; then
  echo -ne "  ${D}│${R}  ${CYN}◌${R} pnpm をインストール中...${CLR}\r"
  if command -v corepack &>/dev/null; then
    corepack enable >> "$LOG" 2>&1 || true
    corepack prepare pnpm@10.4.0 --activate >> "$LOG" 2>&1 || npm install -g pnpm@10 >> "$LOG" 2>&1
  else
    npm install -g pnpm@10 >> "$LOG" 2>&1
  fi
fi
ok "pnpm $(pnpm --version)"

# =============================================================================
#  PostgreSQL
# =============================================================================
head "データベース"

if port_in_use 54322; then
  # Port already in use — check if we can use it as-is
  ok "既存の PostgreSQL を検出 (localhost:54322)"
  msg "${D}Supabase またはDocker が既に起動中 → そのまま使用します${R}"
  SKIP_DOCKER=true
else
  run "PostgreSQL コンテナを起動" $COMPOSE up -d db \
    || die "PostgreSQL の起動に失敗しました"

  # Wait for ready
  echo -ne "  ${D}│${R}  ${CYN}◌${R} PostgreSQL の起動を待機中...${CLR}\r"
  for i in $(seq 1 30); do
    if $COMPOSE exec -T db pg_isready -U postgres >> "$LOG" 2>&1; then
      echo -e "  ${D}│${R}  ${GRN}✔${R} PostgreSQL 起動完了${CLR}"
      break
    fi
    sleep 1
    [ "$i" -eq 30 ] && die "PostgreSQL の起動がタイムアウトしました（30秒）"
  done
fi

# =============================================================================
#  パッケージインストール
# =============================================================================
head "パッケージ"

if [ ! -f .env ]; then
  cp .env.example .env
  ok ".env 作成（デフォルト設定 → localhost:54322）"
else
  ok ".env 既存（上書きなし）"
fi

run "依存関係をインストール" pnpm install \
  || die "pnpm install に失敗しました\n     ${D}ログ: $LOG${R}"

# =============================================================================
#  データベースセットアップ
# =============================================================================
head "データベースセットアップ"

run "Prisma Client を生成" pnpm db:generate \
  || die "Prisma Client の生成に失敗しました"

run "スキーマを DB に反映" pnpm --filter @ojpp/db push \
  || die "スキーマの反映に失敗しました\n     ${D}DATABASE_URL を確認してください${R}"

if run "初期データを投入 (政党・都道府県・議員)" pnpm db:seed; then
  :
else
  wrn "スキップ（既にデータが存在）"
fi

if run "データソースを取り込み (資金・議会・政策)" pnpm ingest:all; then
  :
else
  wrn "スキップ（既にデータが存在）"
fi

# =============================================================================
#  アプリ起動
# =============================================================================
head "アプリ起動"

DEV_LOG="/tmp/ojpp-dev-$(date +%s).log"
pnpm dev > "$DEV_LOG" 2>&1 &
DEV_PID=$!

# Cleanup handler
cleanup() {
  echo ""
  echo -ne "  ${CYN}◇${R}  停止中...\r"
  kill "$DEV_PID" 2>/dev/null || true
  wait "$DEV_PID" 2>/dev/null || true
  if [ "$SKIP_DOCKER" = false ]; then
    $COMPOSE down >> "$LOG" 2>&1 || true
  fi
  echo -e "  ${GRN}◆${R}  ${B}停止完了${R}      "
  echo ""
}
trap cleanup INT TERM

msg "${D}初回起動はコンパイルに時間がかかります...${R}"

wait_for_app() {
  local port=$1 name=$2
  echo -ne "  ${D}│${R}  ${CYN}◌${R} ${name} を起動中...${CLR}\r"
  for i in $(seq 1 120); do
    if curl -sf -o /dev/null --connect-timeout 1 "http://localhost:$port" 2>/dev/null; then
      echo -e "  ${D}│${R}  ${GRN}✔${R} ${name}${CLR}"
      return 0
    fi
    if ! kill -0 "$DEV_PID" 2>/dev/null; then
      echo -e "  ${D}│${R}  ${RED}✖${R} ${name}${CLR}"
      die "開発サーバーが異常終了しました\n     ${D}ログ: $DEV_LOG${R}"
    fi
    sleep 1
  done
  wrn "${name} の起動に時間がかかっています"
}

wait_for_app 3000 "MoneyGlass"
wait_for_app 3002 "PolicyDiff"
wait_for_app 3003 "ParliScope"

# =============================================================================
#  完了
# =============================================================================
ELAPSED=$((SECONDS - TOTAL_START))
MINS=$((ELAPSED / 60))
SECS=$((ELAPSED % 60))

echo ""
echo -e "  ${GRN}◆${R}  ${B}${GRN}セットアップ完了！${R} ${D}(${MINS}分${SECS}秒)${R}"
echo -e "  ${D}│${R}"
echo -e "  ${D}│${R}  🏦 ${B}MoneyGlass${R}   ${CYN}http://localhost:3000${R}   政治資金可視化"
echo -e "  ${D}│${R}  📋 ${B}PolicyDiff${R}   ${CYN}http://localhost:3002${R}   政策比較"
echo -e "  ${D}│${R}  🏛️  ${B}ParliScope${R}   ${CYN}http://localhost:3003${R}   議会監視"
echo -e "  ${D}│${R}"
echo -e "  ${D}│${R}  ${D}管理画面: localhost:3001 (MoneyGlass) · localhost:3004 (ParliScope)${R}"
echo -e "  ${D}│${R}"
echo -e "  ${D}└${R}  ${D}Ctrl+C で停止 · ログ: ${DEV_LOG}${R}"
echo ""

# Keep running until Ctrl+C
wait "$DEV_PID" 2>/dev/null || true
