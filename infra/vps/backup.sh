#!/usr/bin/env bash
# =============================================================================
# FREDO 3D — Backup (Postgres dump + media + config)
# -----------------------------------------------------------------------------
# v1 (static-first): there is no Postgres and no CMS media yet. This script
# still runs safely — it skips the missing pieces and always backs up:
#   - the repo's committed state + working patch (git bundle)
#   - the env file (chmod 600)
#   - any media present under /data/fredo3d/media (today: empty)
#   - the docker-compose + Caddyfile + cms-hold config
# When v2 adds Postgres + Payload media, the same script will dump them.
#
# Retention: BACKUP_RETENTION_DAYS (default 14).
# Run via cron daily (see BACKUP-RESTORE.md):
#   17 3 * * *  /opt/pauli-effect/clients/fredo3d/scripts/backup.sh
# =============================================================================
set -Eeuo pipefail

# ---- Paths -----------------------------------------------------------------
ROOT="/opt/pauli-effect/clients/fredo3d"
APP_DIR="$ROOT/app"
ENV_FILE="$ROOT/config/.env"
BACKUP_DIR="$ROOT/data/backups"
LOG_DIR="$ROOT/logs"
TS="$(date -u +%Y%m%dT%H%M%SZ)"
TODAY="$(date -u +%Y%m%d)"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"

# Load env for PG credentials (silent if absent)
if [[ -f "$ENV_FILE" ]]; then set -a; . "$ENV_FILE" 2>/dev/null || true; set +a; fi

mkdir -p "$BACKUP_DIR" "$LOG_DIR"
LOG="$LOG_DIR/backup-$TS.log"
log() { printf '[backup %s] %s\n' "$(date -u +%H:%M:%S)" "$*" | tee -a "$LOG"; }
die() { log "ERROR: $*"; exit 1; }

DST="$BACKUP_DIR/$TODAY"
mkdir -p "$DST"
log "Backup target: $DST"

# ---- 1. Postgres dump (only if Postgres is running) -----------------------
PG_OK=0
if docker ps --format '{{.Names}}' 2>/dev/null | grep -q '^fredo3d-postgres$'; then
  log "Postgres container detected. Dumping $POSTGRES_DB..."
  docker exec fredo3d-postgres pg_dump -U "${POSTGRES_USER:-fredo_content}" "${POSTGRES_DB:-fredo_content}" \
    --no-owner --clean --if-exists \
    | gzip -9 > "$DST/postgres.sql.gz"
  SIZE="$(wc -c < "$DST/postgres.sql.gz")"
  [[ "$SIZE" -gt 50 ]] || die "Postgres dump is empty (size=$SIZE). Aborting."
  log "  postgres.sql.gz ($SIZE bytes)"
  PG_OK=1
else
  log "No fredo3d-postgres container running — skipping DB dump (expected in v1)."
fi

# ---- 2. Media -------------------------------------------------------------
MEDIA_SRC="${CONTENT_STUDIO_MEDIA_DIR:-/data/fredo3d/media}"
if [[ -d "$MEDIA_SRC" ]]; then
  log "Archiving media from $MEDIA_SRC..."
  tar -czf "$DST/media.tar.gz" -C "$(dirname "$MEDIA_SRC")" "$(basename "$MEDIA_SRC")" 2>/dev/null || true
  log "  media.tar.gz ($(wc -c < "$DST/media.tar.gz") bytes)"
else
  log "No media dir at $MEDIA_SRC — skipping (expected in v1)."
fi

# ---- 3. Config + repo bundle ----------------------------------------------
log "Archiving config + docker-compose + Caddyfile..."
tar -czf "$DST/config.tar.gz" \
  -C "$ROOT" \
  app/infra/vps/docker-compose.yml \
  app/infra/vps/Caddyfile \
  app/infra/vps/Caddyfile.fragment \
  app/infra/vps/cms-hold \
  2>/dev/null || log "  (some optional config files missing — continuing)"

# Env file is copied OUTSIDE the tar so it can have stricter perms.
if [[ -f "$ENV_FILE" ]]; then
  cp -p "$ENV_FILE" "$DST/.env.backup"
  chmod 600 "$DST/.env.backup"
  log "  .env.backup (chmod 600)"
fi

# Repo bundle: full git history + current refs (fast disaster recovery)
if [[ -d "$APP_DIR/.git" ]]; then
  log "git bundle..."
  ( cd "$APP_DIR" && git bundle create "$DST/repo.bundle" --all ) 2>&1 | tee -a "$LOG" \
    || log "  git bundle failed (continuing; config already captured)"
fi

# ---- 4. Manifest ----------------------------------------------------------
{
  echo "# FREDO 3D backup manifest"
  echo "date_utc: $TS"
  echo "host: $(hostname)"
  echo "pg_dumped: $PG_OK"
  echo "retention_days: $RETENTION_DAYS"
  echo "files:"
  ( cd "$DST" && ls -la | awk 'NR>1 {print "  "$NF" "$5" bytes"}' )
} > "$DST/MANIFEST.md"
log "Manifest written."

# ---- 5. Verify non-empty backup ------------------------------------------
BYTES="$(du -sb "$DST" | cut -f1)"
[[ "$BYTES" -gt 200 ]] || die "Backup directory is suspiciously small ($BYTES bytes). Aborting before pruning."

# ---- 6. Prune old backups -------------------------------------------------
log "Pruning backups older than $RETENTION_DAYS days..."
PRUNED=0
while IFS= read -r old; do
  log "  removing $old"
  rm -rf "$old"
  PRUNED=$((PRUNED+1))
done < <(find "$BACKUP_DIR" -maxdepth 1 -type d -name '20[0-9][0-9]-[0-9][0-9]-[0-9][0-9]' -mtime +"$RETENTION_DAYS")

log "=============================================================="
log "BACKUP COMPLETE  ($TODAY)"
log "  location : $DST"
log "  size     : $BYTES bytes"
log "  pruned   : $PRUNED old backup(s)"
log "=============================================================="
