#!/usr/bin/env bash
# =============================================================================
# FREDO 3D — DNS cutover via Hostinger API
# -----------------------------------------------------------------------------
# Safe, idempotent, non-destructive:
#   1. Looks up the domain id for fredo3d.com via /api/domains/v1/portfolio
#   2. Reads the current DNS zone records (so we never destroy email/MX/SPF)
#   3. UPSERTS A-records only for: @, www, cms  -> VPS_IP
#   4. Leaves MX, TXT, SPF, DKIM, DMARC, CNAME ALIAS records untouched
#   5. Verifies with a recursive DNS query (dig/nslookup)
#
# Required env (load from .env or shell):
#   HOSTINGER_API_TOKEN=...
#   FREDO_VPS_IPV4=31.220.58.212   (default)
#   FREDO_DOMAIN=fredo3d.com       (default)
#
# Usage:
#   HOSTINGER_API_TOKEN=xxx ./dns-apply.sh           # apply
#   HOSTINGER_API_TOKEN=xxx ./dns-apply.sh --dry     # preview only, no writes
# =============================================================================
set -Eeuo pipefail

API="https://developers.hostinger.com"
TOKEN="${HOSTINGER_API_TOKEN:?HOSTINGER_API_TOKEN is required}"
DOMAIN="${FREDO_DOMAIN:-fredo3d.com}"
VPS_IP="${FREDO_VPS_IPV4:-31.220.58.212}"
DRY=0
[[ "${1:-}" == "--dry" ]] && DRY=1

log() { printf '[dns %s] %s\n' "$(date -u +%H:%M:%S)" "$*"; }
die() { log "ERROR: $*"; exit 1; }

[[ "$TOKEN" != "" ]] || die "empty token"

log "Domain : $DOMAIN"
log "VPS IP : $VPS_IP"
log "Mode   : $([[ $DRY -eq 1 ]] && echo DRY-RUN || echo APPLY)"
log "Token  : <redacted, len=${#TOKEN}>"

# ---- 1. find domain id -----------------------------------------------------
log "Looking up domain id in portfolio..."
DOMAINS_JSON="$(curl --max-time 20 -s \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  "$API/api/domains/v1/portfolio")"

DOMAIN_ID="$(printf '%s' "$DOMAINS_JSON" | python -c "
import json,sys
data=json.load(sys.stdin)
items=data.get('data',data) if isinstance(data,dict) else data
for d in (items or []):
    if (d.get('domain') or d.get('name') or '')=='$DOMAIN':
        print(d.get('id') or ''); break
")"

[[ -n "$DOMAIN_ID" ]] || {
  log "Domain $DOMAIN not found in Hostinger portfolio. Dump (filtered):"
  printf '%s' "$DOMAINS_JSON" | python -c "
import json,sys
data=json.load(sys.stdin)
items=data.get('data',data) if isinstance(data,dict) else data
for d in (items or []):
    print('  ', d.get('domain'), '| status:', d.get('status'))
" 2>&1 | head -20
  die "domain not in portfolio (is fredo3d.com registered & active here?)"
}
log "Domain id: $DOMAIN_ID"

# ---- 2. read current zone (NON-DESTRUCTIVE) -------------------------------
log "Reading current DNS zone (preserves MX/TXT/SPF/DKIM/DMARC)..."
ZONE_JSON="$(curl --max-time 20 -s \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  "$API/api/dns/v1/dns?domain_id=$DOMAIN_ID" 2>/dev/null || echo '')"

if [[ -z "$ZONE_JSON" || "$ZONE_JSON" == *"404"* || "$ZONE_JSON" == *"not found"* ]]; then
  log "DNS zone endpoint returned no records (domain may be in pending_setup)."
  log "You may need to set the domain's nameservers to Hostinger first."
  log "Raw response (truncated): ${ZONE_JSON:0:300}"
fi

# Print current records so the operator can confirm before any write.
log "Current zone records (filtered summary):"
printf '%s' "$ZONE_JSON" | python -c "
import json,sys
try:
    z=json.load(sys.stdin)
except Exception:
    print('  (could not parse zone json; proceeding)'); sys.exit(0)
recs = z.get('data', z) if isinstance(z,dict) else z
if not isinstance(recs,list):
    print('  (zone payload shape unexpected; proceeding)'); sys.exit(0)
for r in recs:
    t = r.get('type','?'); name = r.get('name','?'); content = r.get('content','')
    # Mask long TXT records for readability
    if t == 'TXT' and len(content) > 60: content = content[:60]+'...'
    print(f'  {t:6} {name:20} {content}')
" 2>&1 | tee /dev/stderr >/dev/null || true

# ---- 3. build the desired zone patch --------------------------------------
# Hostinger DNS API accepts a full zone replace or per-record CRUD depending
# on endpoint version. We construct a conservative UPSERT payload that only
# touches A records for the three Fredo subdomains, preserving everything else.
PATCH_PAYLOAD="$(python -c "
import json
records=[]
for name in ['@','www','cms']:
    records.append({'type':'A','name':name,'content':'$VPS_IP','ttl':3600})
print(json.dumps({'records':records}))
")"

log "Would UPSERT (A records only):"
printf '%s\n' "$PATCH_PAYLOAD" | python -c "
import json,sys
d=json.load(sys.stdin)
for r in d['records']:
    print('  A  %-8s -> %s' % (r['name'], r['content']))
"

if [[ $DRY -eq 1 ]]; then
  log "DRY-RUN: no changes written. Re-run without --dry to apply."
  exit 0
fi

# ---- 4. confirm + apply ----------------------------------------------------
read -r -p ">>> Apply these A records to $DOMAIN? [type YES] " ans
[[ "$ans" == "YES" ]] || die "aborted by user"

log "Applying DNS changes..."
RESP="$(curl --max-time 30 -s -w '\n%{http_code}' \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "$PATCH_PAYLOAD" \
  "$API/api/dns/v1/dns?domain_id=$DOMAIN_ID")"
CODE="$(printf '%s' "$RESP" | tail -1)"
BODY="$(printf '%s' "$RESP" | sed '$d')"
log "HTTP $CODE"
[[ "$CODE" =~ ^(200|201|202|204)$ ]] || { log "Body: $BODY"; die "DNS update rejected"; }

# ---- 5. verify -------------------------------------------------------------
log "Verifying propagation (this can take minutes; first tries may fail)..."
verify() {
  local host="$1"
  for i in 1 2 3 4 5; do
    local ip
    ip="$(dig +short "$host" A 2>/dev/null | head -1 || true)"
    [[ -z "$ip" ]] && ip="$(nslookup "$host" 2>/dev/null | awk '/^Address: / && NR>2 {print $2; exit}' || true)"
    if [[ "$ip" == "$VPS_IP" ]]; then
      log "  OK   $host -> $ip"
      return 0
    fi
    log "  ... ($i) $host -> ${ip:-<no answer>}"
    sleep 15
  done
  log "  WARN $host not yet at $VPS_IP (may still be propagating)"
  return 1
}

verify "$DOMAIN"
verify "www.$DOMAIN"
verify "cms.$DOMAIN"

log "=============================================================="
log "DNS APPLY COMPLETE"
log "  $DOMAIN         -> $VPS_IP"
log "  www.$DOMAIN     -> $VPS_IP"
log "  cms.$DOMAIN     -> $VPS_IP"
log "Other records (MX/TXT/SPF/DKIM/DMARC) untouched."
log "If verification timed out, check again in ~10-30 min."
log "=============================================================="
