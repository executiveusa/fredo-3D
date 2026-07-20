#!/usr/bin/env bash
# =============================================================================
# FREDO 3D — Health check
# -----------------------------------------------------------------------------
# Verifies the local container stack is up and serving, plus (optionally) the
# public HTTPS endpoints after DNS cutover. Exits 0 if healthy, 1 otherwise.
# Designed for: cron monitoring, Uptime Kuma "push" calls, manual sanity checks.
#
# Usage:
#   ./healthcheck.sh               # local only (always)
#   ./healthcheck.sh --public      # also test https://fredo3d.com (post-cutover)
# =============================================================================
set -Eeuo pipefail

ROOT="/opt/the-pauli-effect/clients/fredo3d"
LOG_DIR="$ROOT/logs"
mkdir -p "$LOG_DIR"
TS="$(date -u +%Y%m%dT%H%M%SZ)"
LOG="$LOG_DIR/health-$TS.log"

log()  { printf '[health %s] %s\n' "$(date -u +%H:%M:%S)" "$*" | tee -a "$LOG"; }
fail() { log "FAIL: $*"; RESULT=1; }
RESULT=0

log "==== FREDO 3D health check ===="

# ---- 1. Containers up ------------------------------------------------------
out="$(docker compose --env-file "$ROOT/config/.env" -f "$ROOT/app/infra/vps/docker-compose.yml" ps --format '{{.Service}}|{{.Status}}' 2>/dev/null || true)"
if [[ -z "$out" ]]; then
  fail "no containers reported by docker compose ps"
else
  while IFS='|' read -r svc status; do
    if [[ "$status" == Up*(healthy)* ]]; then
      log "  OK   $svc: $status"
    elif [[ "$status" == Up* ]]; then
      log "  WARN $svc: $status (up but not healthy yet)"
    else
      fail "$svc not up: $status"
    fi
  done <<< "$out"
fi

# ---- 2. Local HTTP probes --------------------------------------------------
probe() {
  local url="$1" expect="${2:-200}"
  local code; code="$(curl --max-time 8 -s -o /dev/null -w '%{http_code}' "$url" || echo 000)"
  if [[ "$code" =~ ^($expect)$ ]]; then
    log "  OK   $url -> $code"
  else
    fail "$url -> $code (expected $expect)"
  fi
}

log "-- local probes --"
# Host ports 3030/3031 chosen to avoid collision with supabase-studio (3001) on shared VPS.
probe "http://127.0.0.1:3030/"            "200|307|308"
probe "http://127.0.0.1:3030/es"          "200"
probe "http://127.0.0.1:3030/en"          "200"
probe "http://127.0.0.1:3030/es/galeria"  "200"
probe "http://127.0.0.1:3030/es/blog"     "200"
probe "http://127.0.0.1:3030/sitemap.xml" "200"
probe "http://127.0.0.1:3030/robots.txt"  "200"
probe "http://127.0.0.1:3031/"            "200"

# ---- 3. Public HTTPS probes (opt-in) --------------------------------------
if [[ "${1:-}" == "--public" ]]; then
  log "-- public probes --"
  probe "https://fredo3d.com/"            "200"
  probe "https://fredo3d.com/es"          "200"
  probe "https://fredo3d.com/sitemap.xml" "200"
  probe "https://www.fredo3d.com/"        "200|301|307|308"
  probe "https://cms.fredo3d.com/"        "200"

  log "-- TLS validity --"
  if command -v openssl >/dev/null; then
    for host in fredo3d.com www.fredo3d.com cms.fredo3d.com; do
      expiry="$(echo | openssl s_client -servername "$host" -connect "$host:443" 2>/dev/null \
        | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2 || true)"
      if [[ -n "$expiry" ]]; then
        log "  $host cert valid until: $expiry"
      else
        fail "could not read cert for $host"
      fi
    done
  fi
fi

# ---- 4. Disk space ---------------------------------------------------------
AVAIL_PCT="$(df -P "$ROOT" | awk 'NR==2 {print $5}' | tr -d '%')"
if (( AVAIL_PCT > 90 )); then
  fail "disk usage on $ROOT is ${AVAIL_PCT}% — backups/services at risk"
else
  log "  OK   disk usage ${AVAIL_PCT}%"
fi

# ---- 5. Recent backup present ---------------------------------------------
LATEST_BACKUP="$(find "$ROOT/data/backups" -maxdepth 1 -type d -name '20[0-9]{2}-[0-9]{2}-[0-9]{2}' 2>/dev/null | sort -r | head -1)"
if [[ -n "$LATEST_BACKUP" ]]; then
  log "  OK   last backup: $(basename "$LATEST_BACKUP")"
else
  log "  WARN no backups yet under $ROOT/data/backups"
fi

log "==== result: $([[ $RESULT -eq 0 ]] && echo HEALTHY || echo UNHEALTHY) ===="
exit $RESULT
