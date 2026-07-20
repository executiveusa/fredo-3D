# BACKUP & RESTORE — FREDO 3D

> Daily automated backups + tested restore. v1: no database yet, so Postgres dump is dormant (the script handles its absence gracefully).

## What gets backed up

Each daily backup at `/opt/pauli-effect/clients/fredo3d/data/backups/YYYY-MM-DD/` contains:

| File | Contents | v1 status |
|---|---|---|
| `postgres.sql.gz` | Compressed `pg_dump --clean --if-exists --no-owner` | ⏳ dormant (no PG yet) |
| `media.tar.gz` | `/data/fredo3d/media` | ⏳ empty in v1 |
| `config.tar.gz` | `docker-compose.yml`, `Caddyfile`, `Caddyfile.fragment`, `cms-hold/` | ✅ |
| `.env.backup` | Copy of the populated env (chmod 600) | ✅ |
| `repo.bundle` | Full `git bundle --all` (cloneable) | ✅ |
| `MANIFEST.md` | Timestamps, sizes, retention, pg_dumped flag | ✅ |

## Schedule & retention

- **Schedule**: 03:17 UTC daily (cron). See `VPS-OPERATIONS.md`.
- **Retention**: 14 days (configurable via `BACKUP_RETENTION_DAYS` in `.env`).
- **Pruning**: backups older than retention are removed only after the new backup is verified non-empty.

## Running a backup

```bash
# Ad-hoc
/opt/pauli-effect/clients/fredo3d/scripts/backup.sh

# View today's backup
ls -la /opt/pauli-effect/clients/fredo3d/data/backups/$(date -u +%Y-%m-%d)/
cat   /opt/pauli-effect/clients/fredo3d/data/backups/$(date -u +%Y-%m-%d)/MANIFEST.md
```

## Verifying a backup (manual test)

Run at least once after first deploy, then periodically:

```bash
# 1. Trigger a manual backup
/opt/pauli-effect/clients/fredo3d/scripts/backup.sh

# 2. Confirm it is non-empty
D=/opt/pauli-effect/clients/fredo3d/data/backups/$(date -u +%Y-%m-%d)
du -sh "$D"
[[ -s "$D/config.tar.gz" ]] && echo "config OK" || echo "config MISSING"

# 3. (v2 only) test the postgres dump loads on a throwaway PG
docker run --rm -d --name pg-verify -e POSTGRES_PASSWORD=test postgres:16-alpine
sleep 5
gunzip -c "$D/postgres.sql.gz" | docker exec -i pg-verify psql -U postgres
docker rm -f pg-verify

# 4. Verify the repo.bundle is a valid clone
git clone "$D/repo.bundle" /tmp/fredo-verify && ls /tmp/fredo-verify && rm -rf /tmp/fredo-verify
```

## Restoring

`restore.sh` is interactive and **always asks for explicit confirmation** before overwriting `.env`, config, or Postgres. It will not run non-interactively.

```bash
# List + pick a date
/opt/pauli-effect/clients/fredo3d/scripts/restore.sh

# Restore a specific date
/opt/pauli-effect/clients/fredo3d/scripts/restore.sh 2026-07-19
```

What it does (in order):

1. **config** — extracts `config.tar.gz` into the live `app/infra/vps/` tree.
2. **.env** — copies `.env.backup` to `config/.env` (chmod 600). Prompts YES.
3. **media** — extracts `media.tar.gz` into `/data/fredo3d/media`.
4. **postgres** — loads `postgres.sql.gz` into `fredo3d-postgres` (v2). Prompts YES.
5. **repo.bundle** — NOT auto-restored; printed as a `git clone` command for manual DR.

After restore:

```bash
cd /opt/pauli-effect/clients/fredo3d/app
infra/vps/deploy.sh
```

## Disaster recovery — full rebuild on a fresh VPS

If the entire VPS is lost:

1. Provision a new Hostinger KVM 2 with Ubuntu 24.04 + Coolify.
2. Mount yesterday's backup (copy the date directory off-box — recommended: rsync to a separate location or download from Coolify's file manager).
3. From the backup:
   - `git clone repo.bundle /opt/pauli-effect/clients/fredo3d/app`
   - Restore `.env` to `config/.env` (chmod 600)
   - Restore `config.tar.gz` over `app/infra/vps/`
4. Run `deploy.sh`.
5. Update DNS via `dns-apply.sh` with the new VPS IP.
6. (v2) Restore postgres + media.

The `repo.bundle` is a complete offline clone — sufficient on its own to rebuild the application. Everything else is data.

## Monitoring backup health

- The daily cron writes to `logs/cron-backup.log`.
- `healthcheck.sh` reports the most recent backup directory (warns if none exists).
- A failed backup (e.g. empty dump) exits non-zero; cron captures the failure in the log.
