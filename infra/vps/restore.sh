#!/usr/bin/env bash
# =============================================================================
# FREDO 3D — Restore from a backup
# -----------------------------------------------------------------------------
# Usage:
#   ./restore.sh                       # interactive: list + pick today's date
#   ./restore.sh 2026-07-19            # restore a specific date's backup
#
# Restores (in order):
#   1. config.tar.gz     -> /opt/.../fredo3d/app/infra/vps/...
#   2. .env.backup       -> /opt/.../fredo3d/config/.env  (chmod 600)
#   3. media.tar.gz      -> /data/fredo3d/media
#   4. postgres.sql.gz   -> loads into fredo3d-postgres (v2+ only)
#   5. repo.bundle       -> optional git disaster recovery (skipped by default)
#
# NEVER runs against a live production stack without explicit confirmation.
# Always prompts before touching Postgres or .env.
# =============================================================================
set -Eeuo pipefail

ROOT="/opt/the-pauli-effect/clients/fredo3d"
APP_DIR="$ROOT/app"
BACKUP_DIR="$ROOT/data/backups"
LOG_DIR="$ROOT/logs"
TS="$(date -u +%Y%m%dT%H%M%SZ)"
LOG="$LOG_DIR/restore-$TS.log"
mkdir -p "$LOG_DIR"

log()  { printf '[restore %s] %s\n' "$(date -u +%H:%M:%S)" "$*" | tee -a "$LOG"; }
die()  { log "ERROR: $*"; exit 1; }
confirm() {
  local ans
  read -r -p ">>> $* [type YES to proceed] " ans
  [[ "$ans" == "YES" ]] || die "aborted by user"
}

# ---- Resolve backup date ---------------------------------------------------
DATE="${1:-}"
if [[ -z "$DATE" ]]; then
  log "Available backups:"
  ls -1 "$BACKUP_DIR" | grep -E '^20[0-9]{2}-[0-9]{2}-[0-9]{2}$' | sort -r | head -20
  read -r -p ">>> enter date (YYYY-MM-DD): " DATE
fi
SRC="$BACKUP_DIR/$DATE"
[[ -d "$SRC" ]] || die "No backup at $SRC"

log "Restoring from: $SRC"
log "Contents:"; ls -la "$SRC" | tee -a "$LOG"

confirm "This will overwrite config, .env, media. Continue?"

# ---- 1. config ------------------------------------------------------------
if [[ -f "$SRC/config.tar.gz" ]]; then
  log "Restoring config..."
  tar -xzf "$SRC/config.tar.gz" -C "$ROOT" || die "config restore failed"
  log "  ok"
else
  log "No config.tar.gz — skipping."
fi

# ---- 2. .env --------------------------------------------------------------
if [[ -f "$SRC/.env.backup" ]]; then
  confirm ".env will be overwritten. Continue?"
  install -m 600 "$SRC/.env.backup" "$ROOT/config/.env"
  log "  .env restored (chmod 600)"
fi

# ---- 3. media -------------------------------------------------------------
if [[ -f "$SRC/media.tar.gz" ]]; then
  log "Restoring media..."
  mkdir -p /data/fredo3d
  tar -xzf "$SRC/media.tar.gz" -C /data/fredo3d || die "media restore failed"
  log "  ok"
fi

# ---- 4. postgres ----------------------------------------------------------
if [[ -f "$SRC/postgres.sql.gz" ]]; then
  # Only attempt if the container is running and the DB exists.
  if docker ps --format '{{.Names}}' | grep -q '^fredo3d-postgres$'; then
    confirm "Postgres will be OVERWRITTEN with this backup. Continue?"
    if [[ -f "$ROOT/config/.env" ]]; then set -a; . "$ROOT/config/.env" 2>/dev/null || true; set +a; fi
    log "Loading SQL into fredo3d-postgres..."
    gunzip -c "$SRC/postgres.sql.gz" \
      | docker exec -i fredo3d-postgres psql -U "${POSTGRES_USER:-fredo_content}" -d "${POSTGRES_DB:-fredo_content}" \
      || die "psql restore failed"
    log "  ok"
  else
    log "postgres.sql.gz present but no fredo3d-postgres container running — skipping (v1)."
  fi
fi

# ---- 5. repo.bundle (manual only) ----------------------------------------
if [[ -f "$SRC/repo.bundle" ]]; then
  log "repo.bundle available at $SRC/repo.bundle (NOT restored automatically)."
  log "  to restore:  git clone $SRC/repo.bundle fredo3d-recovered"
fi

log "=============================================================="
log "RESTORE COMPLETE  (from $DATE)"
log "Next steps:"
log "  cd $APP_DIR && infra/vps/deploy.sh"
log "=============================================================="
