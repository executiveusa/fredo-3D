# CUTOVER RUNBOOK — FREDO 3D

> The exact sequence a human with SSH access runs to take FREDO 3D live. ~30 minutes end-to-end, including DNS propagation. **Read all the way through once before starting.**

## Prerequisites (verify before you begin)

- [ ] SSH access to `root@31.220.58.212` (or a sudo-capable user)
- [ ] `HOSTINGER_API_TOKEN` available (already in the Cosmos_Vault)
- [ ] The latest `infra/vps/*.sh`, `apps/web/Dockerfile`, `next.config.ts` are pushed to `main` on GitHub
- [ ] fredo3d.com is in the Hostinger domain portfolio (verified — status `pending_setup`)

## Architecture you are deploying

```
       fredo3d.com / www.fredo3d.com / cms.fredo3d.com
                          │
                          ▼
              Caddy (Coolify proxy, :80/:443)
                          │
            ┌─────────────┴──────────────┐
            ▼                            ▼
      fredo3d-web:3000            fredo3d-cms-hold:80
      (Next.js standalone)        (nginx holding page)
```

The VPS already runs **Coolify** (Ubuntu 24.04 template), which manages Caddy as the public proxy. We do **not** install a second Caddy. We add our two containers to an isolated `fredo3d-network` and route to them from Coolify's proxy.

---

## Phase 0 — Inspect the existing VPS state (don't skip)

```bash
ssh root@31.220.58.212

# What's already here?
docker ps --format '{{.Names}}\t{{.Status}}\t{{.Ports}}'
docker network ls
df -h /
free -m
ufw status verbose

# Coolify UI is at https://<vps-ip-or-coolify-domain>:8000 typically.
# Note what apps are already running — you must NOT disrupt them.
```

**Important**: a previous session left Caddy configured with a `fredo3d.com` Host entry. Find out where:

```bash
# Coolify's Caddy config is usually at:
ls -la /data/coolify/configs/ 2>/dev/null
docker exec coolify-caddy ls /data/caddy/ 2>/dev/null
docker exec coolify-caddy cat /data/caddy/Caddyfile 2>/dev/null | head -50
```

If a fredo3d block already exists there, **inspect it** — you may be able to repoint it instead of recreating.

---

## Phase 1 — Lay down the directory tree + clone

```bash
sudo mkdir -p /opt/the-pauli-effect/clients/fredo3d/{app,config,data/{postgres,media,backups},logs,scripts}
sudo chown -R root:root /opt/the-pauli-effect

# Clone main
sudo git clone https://github.com/executiveusa/fredo-3D.git /opt/the-pauli-effect/clients/fredo3d/app
cd /opt/the-pauli-effect/clients/fredo3d/app
git log --oneline -3     # confirm HEAD matches DEPLOYED-COMMIT.md target

# Symlink the ops scripts for convenience
sudo ln -sf /opt/the-pauli-effect/clients/fredo3d/app/infra/vps/deploy.sh      /opt/the-pauli-effect/clients/fredo3d/scripts/deploy.sh
sudo ln -sf /opt/the-pauli-effect/clients/fredo3d/app/infra/vps/rollback.sh    /opt/the-pauli-effect/clients/fredo3d/scripts/rollback.sh
sudo ln -sf /opt/the-pauli-effect/clients/fredo3d/app/infra/vps/backup.sh      /opt/the-pauli-effect/clients/fredo3d/scripts/backup.sh
sudo ln -sf /opt/the-pauli-effect/clients/fredo3d/app/infra/vps/restore.sh     /opt/the-pauli-effect/clients/fredo3d/scripts/restore.sh
sudo ln -sf /opt/the-pauli-effect/clients/fredo3d/app/infra/vps/healthcheck.sh /opt/the-pauli-effect/clients/fredo3d/scripts/healthcheck.sh
sudo ln -sf /opt/the-pauli-effect/clients/fredo3d/app/infra/vps/dns-apply.sh   /opt/the-pauli-effect/clients/fredo3d/scripts/dns-apply.sh
```

---

## Phase 2 — Populate secrets

```bash
sudo nano /opt/the-pauli-effect/clients/fredo3d/config/.env
# Paste the populated env (from infra/vps/.env.example template + real values).
# At minimum for v1:
#   NEXT_PUBLIC_SITE_NAME=FREDO 3D
#   NEXT_PUBLIC_DEFAULT_LOCALE=es
#   NEXT_PUBLIC_SUPPORTED_LOCALES=es,en
#   NEXT_PUBLIC_WHATSAPP_NUMBER=56993838223
#   PUBLIC_WEB_URL=https://fredo3d.com
#   HOSTINGER_API_TOKEN=<from vault>
#   FREDO_DOMAIN=fredo3d.com
#   FREDO_VPS_IPV4=31.220.58.212
#   BACKUP_RETENTION_DAYS=14
# v2 secrets (POSTGRES_PASSWORD, PAYLOAD_SECRET) can be blank for now.

sudo chmod 600 /opt/the-pauli-effect/clients/fredo3d/config/.env
sudo chown root:root /opt/the-pauli-effect/clients/fredo3d/config/.env

# Verify
sudo stat -c '%a %U:%G %n' /opt/the-pauli-effect/clients/fredo3d/config/.env
# Expected: 600 root:root .../.env
```

---

## Phase 3 — Bring the containers up

```bash
cd /opt/the-pauli-effect/clients/fredo3d/app
sudo /opt/the-pauli-effect/clients/fredo3d/scripts/deploy.sh
```

`deploy.sh` does everything: fetch, fast-forward, build image, `compose up -d`, wait for health, smoke-test.

When it prints `DEPLOY COMPLETE`, verify locally:

```bash
curl -sI http://127.0.0.1:3000/es | head -1   # expect HTTP/1.1 200
curl -sI http://127.0.0.1:3001/   | head -1   # expect HTTP/1.1 200
docker compose --env-file /opt/the-pauli-effect/clients/fredo3d/config/.env \
  -f infra/vps/docker-compose.yml ps
```

All containers should show `Up (healthy)`.

---

## Phase 4 — Wire Caddy (via Coolify)

Two options. **Option A is strongly recommended** because Coolify owns the proxy.

### Option A — Use Coolify's UI (recommended)

1. Open the Coolify dashboard (usually `http://31.220.58.212:8000`).
2. Add the `fredo3d-network` Docker network as a Coolify-attached network (Coolify → Settings → Networks), or attach Coolify's proxy container to it:

   ```bash
   docker network connect fredo3d-network coolify-caddy
   ```

3. In Coolify, create three **Proxy routes** (or equivalent Coolify "Service / Application" entries):

   | Domain | Target | Notes |
   |---|---|---|
   | `fredo3d.com` | `http://fredo3d-web:3000` | primary |
   | `www.fredo3d.com` | permanent redirect → `https://fredo3d.com{uri}` | SEO |
   | `cms.fredo3d.com` | `http://fredo3d-cms-hold:80` | v1 holding |

4. Coolify will issue Let's Encrypt certs automatically once DNS resolves.

### Option B — Manual Caddy config (if Coolify proxy is not usable)

```bash
# Append the drop-in fragment to Coolify's Caddyfile
sudo cp /opt/the-pauli-effect/clients/fredo3d/app/infra/vps/Caddyfile.fragment \
        /data/coolify/configs/fredo3d.Caddyfile.fragment

# Edit Coolify's main Caddyfile to add at the top:
#   include /data/coolify/configs/fredo3d.Caddyfile.fragment
sudo nano /data/coolify/configs/Caddyfile   # or wherever Coolify keeps it

# Validate + reload
docker exec coolify-caddy caddy validate --config /data/caddy/Caddyfile
docker exec coolify-caddy caddy reload --config /data/caddy/Caddyfile
```

If you cannot locate Coolify's Caddyfile, do **not** guess. Stop and consult Coolify docs.

---

## Phase 5 — DNS cutover

Can be run from anywhere with `curl` + `dig`/`nslookup`. Run from the VPS or your local machine.

```bash
export HOSTINGER_API_TOKEN='<from vault>'
sudo /opt/the-pauli-effect/clients/fredo3d/scripts/dns-apply.sh --dry   # preview first
sudo /opt/the-pauli-effect/clients/fredo3d/scripts/dns-apply.sh         # apply for real
```

The script:
- Finds `fredo3d.com` in the Hostinger portfolio.
- Prints the current zone (so you can see MX/TXT/SPF/DKIM/DMARC won't be touched).
- Asks `YES` to confirm.
- UPSERTs `A` records for `@`, `www`, `cms` → `31.220.58.212`.
- Polls `dig` to confirm propagation.

> **If `fredo3d.com` is still `pending_setup`** (not active), the DNS update will fail. In that case:
> 1. Open hPanel → Domains → fredo3d.com.
> 2. Complete the registration/activation step.
> 3. Make sure the domain uses Hostinger nameservers (or whichever authoritative NS you control).
> 4. Re-run `dns-apply.sh`.

---

## Phase 6 — Verify (don't declare victory until these pass)

```bash
# DNS resolves to VPS
dig +short fredo3d.com         # expect: 31.220.58.212
dig +short www.fredo3d.com     # expect: 31.220.58.212
dig +short cms.fredo3d.com     # expect: 31.220.58.212

# HTTPS works with valid cert
curl -I https://fredo3d.com         | head -1   # expect HTTP/2 200
curl -I https://www.fredo3d.com     | head -1   # expect HTTP/2 301/308 (redirect)
curl -I https://cms.fredo3d.com/    | head -1   # expect HTTP/2 200

# Public routes return 200
for path in / /es /en /es/galeria /en/gallery /es/blog /en/blog /es/encargos /en/commissions /sitemap.xml /robots.txt; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "https://fredo3d.com${path}")
  echo "$code  $path"
done

# Cert validity
echo | openssl s_client -servername fredo3d.com -connect fredo3d.com:443 2>/dev/null \
  | openssl x509 -noout -subject -dates

# Stack health
/opt/the-pauli-effect/clients/fredo3d/scripts/healthcheck.sh --public
```

**Definition of DONE (per the deployment brief §35):**

- [ ] `fredo3d.com` resolves to `31.220.58.212`
- [ ] HTTPS valid (Let's Encrypt)
- [ ] `/`, `/es`, `/en` render 200
- [ ] `/es/galeria` works
- [ ] `/es/blog` works
- [ ] artwork pages work
- [ ] WhatsApp CTAs work (click one, WhatsApp opens with prefilled text)
- [ ] `cms.fredo3d.com` shows the holding page
- [ ] Postgres persists (n/a in v1)
- [ ] Backups work (run `backup.sh` once)
- [ ] Docker services healthy
- [ ] No critical runtime errors in logs
- [ ] Production commit recorded (deploy.sh writes `DEPLOYED-COMMIT.md`)
- [ ] Docs written ✅
- [ ] CLIENT-RECORD created ✅
- [ ] GitHub contains all non-secret deployment files (commit `infra/`, `apps/web/Dockerfile`, docs)
- [ ] No secrets committed (run `scripts/fredo-studio.sh secrets`)

---

## Phase 7 — Set up the daily backup cron

```bash
sudo crontab -e
# Add:
17 3 * * * /opt/the-pauli-effect/clients/fredo3d/scripts/backup.sh >> /opt/the-pauli-effect/clients/fredo3d/logs/cron-backup.log 2>&1
*/5 * * * * /opt/the-pauli-effect/clients/fredo3d/scripts/healthcheck.sh >> /opt/the-pauli-effect/clients/fredo3d/logs/cron-health.log 2>&1
```

Trigger the first backup manually to confirm it works:

```bash
sudo /opt/the-pauli-effect/clients/fredo3d/scripts/backup.sh
ls -la /opt/the-pauli-effect/clients/fredo3d/data/backups/$(date -u +%Y-%m-%d)/
```

---

## Phase 8 — Detach Vercel (optional, only if it owns DNS today)

> Skip if fredo3d.com was never attached to Vercel (current state: NXDOMAIN, so this is likely unnecessary).

If Vercel had the custom domain:

1. Confirm the VPS serves correctly at https://fredo3d.com.
2. In Vercel → project → Settings → Domains, **remove** `fredo3d.com`.
3. Do NOT delete the Vercel project — keep it as a historical preview.

---

## Troubleshooting

| Symptom | First check |
|---|---|
| `https://fredo3d.com` shows 502 | Coolify proxy can't reach `fredo3d-web`. Run `docker network inspect fredo3d-network` — confirm `coolify-caddy` is attached. |
| 308 loop on apex | Two Caddy blocks for `fredo3d.com`. Remove the stale one. |
| Cert not issuing | DNS A-record not propagated, or port 80 blocked by UFW. |
| Smoke route returns 404 | Next build stale. Re-run `deploy.sh`. |
| `pending_setup` won't clear | Domain activation needs finishing in hPanel → Domains. Not a deploy issue. |
| Caddy won't reload | Syntax error in Caddyfile. `caddy validate --config <file>`. |

## Rollback

If anything goes wrong after cutover:

```bash
/opt/the-pauli-effect/clients/fredo3d/scripts/rollback.sh
```

Volumes and DNS are untouched. See `ROLLBACK.md`.
