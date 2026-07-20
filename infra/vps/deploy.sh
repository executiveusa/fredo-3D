#!/usr/bin/env bash
# =============================================================================
# FREDO 3D — Production deploy (idempotent, fast-forward only, no force)
# -----------------------------------------------------------------------------
# Runs on the VPS, inside /opt/the-pauli-effect/clients/fredo3d/app (the repo).
# Steps (§25 of the deployment brief):
#   1. git fetch
#   2. checkout approved main
#   3. pull fast-forward only (no force, no reset --hard)
#   4. validate required env files exist
#   5. build images
#   6. docker compose up -d
#   7. wait for health
#   8. smoke tests (public + admin routes)
#   9. print deployed commit
#
# Usage:
#   ./deploy.sh                 # deploy current origin/main
#   ./deploy.sh <commit-sha>    # pin to a specific commit (override)
#
# Never destroys persistent volumes. Never force-pushes or resets.
# =============================================================================
set -Eeuo pipefail

# ---- Paths ------------------------------------------------------------------
APP_DIR="${FREDO_APP_DIR:-/opt/the-pauli-effect/clients/fredo3d/app}"
INFRA_DIR="$APP_DIR/infra/vps"
ENV_FILE="${FREDO_INFRA_ENV:-/opt/the-pauli-effect/clients/fredo3d/config/.env}"
COMPOSE_FILE="$INFRA_DIR/docker-compose.yml"

# ---- Logging ---------------------------------------------------------------
LOG_DIR="/opt/the-pauli-effect/clients/fredo3d/logs"
mkdir -p "$LOG_DIR"
TS="$(date -u +%Y%m%dT%H%M%SZ)"
DEPLOY_LOG="$LOG_DIR/deploy-$TS.log"
log()  { printf '[deploy %s] %s\n' "$(date -u +%H:%M:%S)" "$*" | tee -a "$DEPLOY_LOG"; }
die()  { log "ERROR: $*"; exit 1; }

# ---- Safety ----------------------------------------------------------------
[[ -d "$APP_DIR/.git" ]] || die "Not a git repo: $APP_DIR"
[[ -f "$COMPOSE_FILE" ]] || die "Missing compose: $COMPOSE_FILE"
command -v docker >/dev/null || die "docker not found"
docker compose version >/dev/null 2>&1 || die "docker compose v2 not found"

cd "$APP_DIR"
log "Deploy started in $APP_DIR"

# ---- 0. Record pre-deploy state (rollback anchor) --------------------------
PREV_SHA="$(git rev-parse HEAD 2>/dev/null || echo unknown)"
PREV_BRANCH="$(git branch --show-current 2>/dev/null || echo unknown)"
log "Pre-deploy: sha=$PREV_SHA branch=$PREV_BRANCH"
echo "$PREV_SHA" > "$LOG_DIR/.last_good_sha"
echo "$TS"      > "$LOG_DIR/.last_deploy_ts"

# ---- 1. git fetch ----------------------------------------------------------
log "git fetch --tags --prune"
git fetch --tags --prune origin 2>&1 | tee -a "$DEPLOY_LOG" || die "fetch failed"

# ---- 2. checkout main ------------------------------------------------------
BRANCH="${FREDO_DEPLOY_BRANCH:-main}"
log "checkout $BRANCH"
git checkout "$BRANCH" 2>&1 | tee -a "$DEPLOY_LOG" || die "checkout $BRANCH failed"

# ---- 3. fast-forward only --------------------------------------------------
log "merge --ff-only origin/$BRANCH"
if ! git merge --ff-only "origin/$BRANCH" 2>&1 | tee -a "$DEPLOY_LOG"; then
  log "Fast-forward failed. Working tree is not changed. Manual review required."
  die "refusing non-fast-forward update (per §25 — no force pulls)"
fi

# Optional pin override
if [[ "${1:-}" != "" ]]; then
  log "Override pin: $1"
  git checkout "$1" 2>&1 | tee -a "$DEPLOY_LOG" || die "could not checkout $1"
fi

NEW_SHA="$(git rev-parse HEAD)"
log "Target commit: $NEW_SHA"
[ -n "$NEW_SHA" ] || die "could not read new HEAD"

# ---- 4. validate env -------------------------------------------------------
[[ -f "$ENV_FILE" ]] || die "Missing env file: $ENV_FILE (chmod 600 expected)"
log "Env file present: $ENV_FILE"

# ---- 5. build images -------------------------------------------------------
log "docker compose build (this can take several minutes)"
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" build 2>&1 | tee -a "$DEPLOY_LOG" \
  || die "image build failed"

# ---- 6. up -d --------------------------------------------------------------
log "docker compose up -d"
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d 2>&1 | tee -a "$DEPLOY_LOG" \
  || die "compose up failed"

# ---- 7. wait for health ----------------------------------------------------
log "Waiting for containers to become healthy..."
HEALTHY=0
for i in $(seq 1 40); do
  OUT="$(docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps --format '{{.Service}} {{.Status}}' 2>/dev/null || true)"
  log "  [$i] $OUT"
  TOTAL="$(printf '%s\n' "$OUT" | wc -l)"
  H="$(printf '%s\n' "$OUT" | grep -c 'Up (healthy)' || true)"
  if [[ "$TOTAL" -gt 0 && "$H" -eq "$TOTAL" ]]; then HEALTHY=1; break; fi
  sleep 5
done
[[ "$HEALTHY" -eq 1 ]] || { log "Containers not all healthy after 200s"; die "health check failed"; }
log "All containers healthy."

# ---- 8. smoke tests --------------------------------------------------------
log "Smoke tests..."
SMOKE_OK=1
smoke() {
  local url="$1" expect="${2:-200}"
  local code
  code="$(curl --max-time 10 -s -o /dev/null -w '%{http_code}' "$url" || echo 000)"
  if [[ "$code" =~ ^($expect)$ ]]; then
    log "  PASS $url -> $code"
  else
    log "  FAIL $url -> $code (expected $expect)"
    SMOKE_OK=0
  fi
}

# In-container checks (work even before DNS cutover).
smoke "http://127.0.0.1:3000/"            "200|307|308"
smoke "http://127.0.0.1:3000/es"          "200"
smoke "http://127.0.0.1:3000/en"          "200"
smoke "http://127.0.0.1:3000/es/galeria"  "200"
smoke "http://127.0.0.1:3000/es/blog"     "200"
smoke "http://127.0.0.1:3000/sitemap.xml" "200"
smoke "http://127.0.0.1:3000/robots.txt"  "200"
smoke "http://127.0.0.1:3001/"            "200"

[[ "$SMOKE_OK" -eq 1 ]] || die "Smoke tests failed (containers are up, but routes are not 200)."

# ---- 9. record deployed commit --------------------------------------------
echo "$NEW_SHA" > "$LOG_DIR/.last_good_sha"
echo "$TS"      > "$LOG_DIR/.last_deploy_ts"
{
  echo "# DEPLOYED-COMMIT — auto-updated by deploy.sh on $(date -u)"
  echo "- date (UTC): $TS"
  echo "- sha: $NEW_SHA"
  echo "- branch: $BRANCH"
  echo "- previous sha: $PREV_SHA"
  git log -1 --pretty='- commit: %s' "$NEW_SHA"
} > "$APP_DIR/docs/DEPLOYED-COMMIT.md"

log "=============================================================="
log "DEPLOY COMPLETE"
log "  commit : $NEW_SHA"
log "  branch : $BRANCH"
log "  log    : $DEPLOY_LOG"
log "  rollback anchor: $LOG_DIR/.last_good_sha (use rollback.sh)"
log "=============================================================="
