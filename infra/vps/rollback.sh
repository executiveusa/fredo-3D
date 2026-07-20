#!/usr/bin/env bash
# =============================================================================
# FREDO 3D — Rollback to the previous known-good deploy
# -----------------------------------------------------------------------------
# Identifies the previous known-good commit, redeploys it, and NEVER touches
# persistent volumes (postgres/media are safe even in v2).
#
# Behavior:
#   - reads last-good sha from logs/.last_good_sha
#   - if current HEAD == last-good sha, rolls back one deploy further (to the
#     sha recorded before the current one, if available)
#   - git checkout <sha> (detached), rebuild, compose up -d, smoke test
#   - logs everything; never force-pushes; never deletes volumes
#
# Usage:
#   ./rollback.sh            # roll back to the last recorded good sha
#   ./rollback.sh <sha>      # roll back to an explicit commit
# =============================================================================
set -Eeuo pipefail

APP_DIR="${FREDO_APP_DIR:-/opt/the-pauli-effect/clients/fredo3d/app}"
INFRA_DIR="$APP_DIR/infra/vps"
ENV_FILE="${FREDO_INFRA_ENV:-/opt/the-pauli-effect/clients/fredo3d/config/.env}"
COMPOSE_FILE="$INFRA_DIR/docker-compose.yml"
LOG_DIR="/opt/the-pauli-effect/clients/fredo3d/logs"
TS="$(date -u +%Y%m%dT%H%M%SZ)"
ROLLBACK_LOG="$LOG_DIR/rollback-$TS.log"

log() { printf '[rollback %s] %s\n' "$(date -u +%H:%M:%S)" "$*" | tee -a "$ROLLBACK_LOG"; }
die() { log "ERROR: $*"; exit 1; }

mkdir -p "$LOG_DIR"
cd "$APP_DIR"
log "Rollback started."

CURRENT_SHA="$(git rev-parse HEAD)"
log "Current HEAD: $CURRENT_SHA"

# Resolve target sha
if [[ "${1:-}" != "" ]]; then
  TARGET="$1"
elif [[ -f "$LOG_DIR/.last_good_sha" ]]; then
  TARGET="$(cat "$LOG_DIR/.last_good_sha")"
else
  die "No rollback anchor at $LOG_DIR/.last_good_sha. Pass an explicit sha: rollback.sh <sha>"
fi

[[ -n "$TARGET" ]] || die "empty target sha"
log "Target sha: $TARGET"

if [[ "$TARGET" == "$CURRENT_SHA" ]]; then
  log "Target equals current HEAD. Attempting previous deploy anchor (if any)."
  PREVTS="$(cat "$LOG_DIR/.last_deploy_ts" 2>/dev/null || true)"
  # find the most recent deploy log that is NOT the current one
  PREVLOG="$(ls -1t "$LOG_DIR"/deploy-*.log 2>/dev/null | grep -v "$PREVTS" | head -1 || true)"
  if [[ -n "$PREVLOG" ]]; then
    TARGET="$(grep -oE 'Target commit: [a-f0-9]+' "$PREVLOG" | awk '{print $3}' | head -1)"
    log "Resolved earlier target from $PREVLOG: $TARGET"
  fi
  [[ "$TARGET" != "$CURRENT_SHA" ]] || die "Already at the only known-good sha ($CURRENT_SHA). Nothing to roll back to."
fi

# Verify target exists in the repo
git cat-file -e "${TARGET}^{commit}" 2>/dev/null || die "Commit $TARGET not found in repo (was it garbage-collected?)"

# Detached checkout at the target
log "git checkout $TARGET (detached)"
git checkout --detach "$TARGET" 2>&1 | tee -a "$ROLLBACK_LOG" || die "checkout failed"

# Rebuild + redeploy
log "docker compose build"
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" build 2>&1 | tee -a "$ROLLBACK_LOG" || die "build failed"
log "docker compose up -d"
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d 2>&1 | tee -a "$ROLLBACK_LOG" || die "up failed"

# Health wait
for i in $(seq 1 40); do
  OUT="$(docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps --format '{{.Service}} {{.Status}}' 2>/dev/null || true)"
  TOTAL="$(printf '%s\n' "$OUT" | wc -l)"
  H="$(printf '%s\n' "$OUT" | grep -c 'Up (healthy)' || true)"
  if [[ "$TOTAL" -gt 0 && "$H" -eq "$TOTAL" ]]; then break; fi
  sleep 5
done

# Smoke
SMOKE_OK=1
smoke() {
  local code; code="$(curl --max-time 10 -s -o /dev/null -w '%{http_code}' "$1" || echo 000)"
  if [[ "$code" =~ ^(200|307|308)$ ]]; then log "  PASS $1 -> $code"; else log "  FAIL $1 -> $code"; SMOKE_OK=0; fi
}
smoke "http://127.0.0.1:3000/"
smoke "http://127.0.0.1:3000/es"
smoke "http://127.0.0.1:3000/sitemap.xml"

# Record anchor
echo "$TARGET" > "$LOG_DIR/.last_good_sha"
echo "$TS"     > "$LOG_DIR/.last_deploy_ts"

[[ "$SMOKE_OK" -eq 1 ]] || die "Rollback completed but smoke tests FAILED. Investigate."

log "=============================================================="
log "ROLLBACK COMPLETE — now serving $TARGET"
log "Previous (failed) sha was $CURRENT_SHA"
log "Volumes untouched. No data lost."
log "=============================================================="
