# VPS OPERATIONS — FREDO 3D

> Day-2 operational reference. Lives alongside `DEPLOYMENT.md` (architecture) and `CUTOVER-RUNBOOK.md` (initial setup).

## Where things live

```
/opt/the-pauli-effect/clients/fredo3d/
├── app/            # repo (git checkout of main)
├── config/.env     # all secrets (chmod 600, root)
├── data/
│   ├── backups/    # YYYY-MM-DD/ per day
│   ├── media/      # (v2) artwork uploads
│   └── postgres/   # (v2) PG data dir
├── logs/           # deploy/backup/health/rollback + .last_good_sha
└── scripts/        # symlinks to app/infra/vps/*.sh
```

## Common tasks

### Check service health

```bash
/opt/the-pauli-effect/clients/fredo3d/scripts/healthcheck.sh
# add --public to also hit https://fredo3d.com
```

### View container status & logs

```bash
docker compose --env-file /opt/the-pauli-effect/clients/fredo3d/config/.env \
  -f /opt/the-pauli-effect/clients/fredo3d/app/infra/vps/docker-compose.yml ps

docker logs --tail 100 fredo3d-web
docker logs --tail 100 fredo3d-cms-hold
```

### Restart a service (no rebuild)

```bash
docker restart fredo3d-web
# or the whole stack:
docker compose --env-file /opt/the-pauli-effect/clients/fredo3d/config/.env \
  -f /opt/the-pauli-effect/clients/fredo3d/app/infra/vps/docker-compose.yml restart
```

### Deploy the latest `main`

```bash
/opt/the-pauli-effect/clients/fredo3d/scripts/deploy.sh
```

This is safe to re-run. Fast-forward only; never force.

### Roll back to the previous good deploy

```bash
/opt/the-pauli-effect/clients/fredo3d/scripts/rollback.sh
# or pin a specific commit:
/opt/the-pauli-effect/clients/fredo3d/scripts/rollback.sh <sha>
```

### Run a backup immediately

```bash
/opt/the-pauli-effect/clients/fredo3d/scripts/backup.sh
```

(Daily cron runs the same script at 03:17 UTC.)

## Cron jobs

Edit with `crontab -e` as root. Recommended entries:

```cron
# Daily backup at 03:17 UTC
17 3 * * *  /opt/the-pauli-effect/clients/fredo3d/scripts/backup.sh >> /opt/the-pauli-effect/clients/fredo3d/logs/cron-backup.log 2>&1

# Health probe every 5 min (silent; logs only on failure)
*/5 * * * * /opt/the-pauli-effect/clients/fredo3d/scripts/healthcheck.sh >> /opt/the-pauli-effect/clients/fredo3d/logs/cron-health.log 2>&1 || (echo "fredo3d unhealthy" | mail -s "fredo3d health" ops@example.com)

# Weekly public health report (certs + routes)
12 4 * * 1  /opt/the-pauli-effect/clients/fredo3d/scripts/healthcheck.sh --public >> /opt/the-pauli-effect/clients/fredo3d/logs/cron-weekly.log 2>&1
```

## Firewall (UFW)

Required public ports: **22, 80, 443**. Everything else internal.

```bash
ufw status verbose
ufw allow 22/tcp    # SSH — do NOT lock yourself out
ufw allow 80/tcp    # HTTP (Caddy redirect + ACME)
ufw allow 443/tcp   # HTTPS
ufw allow 443/tcp   # also IPv6 if applicable
# Containers bind to 127.0.0.1 only — not publicly exposed.
ufw enable
```

> The Coolify stack may already manage some UFW rules. Inspect `ufw status` before enabling to avoid surprises.

## Docker housekeeping

```bash
# Show disk usage by Docker
docker system df

# Prune unused images + build cache (keeps volumes/data intact)
docker image prune -a --filter "until=168h"
docker builder prune --filter "until=168h"

# NEVER run `docker volume prune` on this host — it would delete fredo3d_postgres_data (v2) and Coolify volumes.
```

## Log rotation

All services use `json-file` driver with `max-size`/`max-file` set in `docker-compose.yml`. Caddy writes to `/data/fredo3d/logs/caddy-*.log` with `roll_size`/`roll_keep`. Host-level logs in `/opt/the-pauli-effect/clients/fredo3d/logs/` should be rotated via logrotate:

```bash
cat > /etc/logrotate.d/fredo3d <<'EOF'
/opt/the-pauli-effect/clients/fredo3d/logs/*.log {
  daily
  rotate 14
  compress
  delaycompress
  missingok
  notifempty
  copytruncate
}
EOF
```

## Updating secrets

1. Edit `/opt/the-pauli-effect/clients/fredo3d/config/.env` (chmod 600).
2. Restart affected containers:

   ```bash
   docker compose --env-file /opt/the-pauli-effect/clients/fredo3d/config/.env \
     -f /opt/the-pauli-effect/clients/fredo3d/app/infra/vps/docker-compose.yml up -d
   ```

3. Never commit the `.env` to Git. The `.gitignore` already excludes `.env*`.

## SSL / certificates

Caddy issues and renews Let's Encrypt certs automatically. To inspect:

```bash
docker exec coolify-caddy caddy list-modules | grep -i tls
docker exec coolify-caddy caddy validate --config /data/caddy/Caddyfile
```

If a cert fails to issue, check:

- DNS A-records actually resolve to `31.220.58.212`
- Port 80 is reachable (Let's Encrypt HTTP-01 challenge)
- Caddy's ACME log in `/data/fredo3d/logs/caddy-*.log`

## What NOT to do

- ❌ Don't run `docker volume prune` — it nukes data volumes.
- ❌ Don't `git reset --hard` or `git push --force` on `main`.
- ❌ Don't publish port 3000/3001/5432 to 0.0.0.0 (they're loopback-only by design).
- ❌ Don't install a second reverse proxy — Caddy (Coolify) already owns 80/443.
- ❌ Don't disable Coolify without coordinating (it manages other apps on this VPS).
- ❌ Don't put real secrets in any committed file under `infra/` or `apps/`.

## Disk space checklist

If the VPS fills up:

```bash
df -h
docker system df
du -sh /opt/the-pauli-effect/clients/fredo3d/data/backups/*
du -sh /data/fredo3d/logs/* 2>/dev/null
du -sh /var/lib/docker/overlay2 2>/dev/null
```

Backups older than 14 days are pruned automatically by `backup.sh`.
