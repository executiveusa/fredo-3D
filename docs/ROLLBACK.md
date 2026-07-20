# ROLLBACK — FREDO 3D

> Revert to a previous known-good deploy. Never destroys data volumes.

## When to roll back

- Public smoke routes return non-200 after a deploy.
- Containers crash-loop after a deploy.
- A committed change breaks the build or runtime.
- A content/code regression is discovered post-deploy.

**Do NOT roll back for** DNS issues, cert issuance delays, or Coolify outages — those are infrastructure, not code, and rolling back won't help.

## The fast path

`deploy.sh` writes the sha it deployed to `/opt/the-pauli-effect/clients/fredo3d/logs/.last_good_sha`. `rollback.sh` reads it.

```bash
# Roll back to the last recorded good sha
/opt/the-pauli-effect/clients/fredo3d/scripts/rollback.sh
```

The script:

1. Reads `logs/.last_good_sha`.
2. If that equals current HEAD, walks one deploy further back using `logs/deploy-*.log`.
3. `git checkout --detach <sha>` (does not move `main`).
4. Rebuilds the image.
5. `docker compose up -d`.
6. Waits for health, runs smoke tests.
7. Updates `.last_good_sha` to the rollback target.
8. Leaves the failed-forward commit intact in history (no `git reset --hard`).

**Volumes are never touched.** Postgres data and media survive every rollback.

## Pinning a specific commit

```bash
/opt/the-pauli-effect/clients/fredo3d/scripts/rollback.sh 1a6ec7a89eb31d5a2c6cec0dd8911fe47137bbb3
```

## Manual rollback (if the script fails)

If the script can't run (e.g. disk full, compose broken):

```bash
cd /opt/the-pauli-effect/clients/fredo3d/app

# 1. Find a known-good commit
git log --oneline -20

# 2. Check it out detached
git checkout --detach <sha>

# 3. Rebuild + restart
docker compose --env-file /opt/the-pauli-effect/clients/fredo3d/config/.env \
  -f infra/vps/docker-compose.yml build
docker compose --env-file /opt/the-pauli-effect/clients/fredo3d/config/.env \
  -f infra/vps/docker-compose.yml up -d

# 4. Smoke test
curl -sI http://127.0.0.1:3000/es | head -1   # expect 200
```

## Rolling back DNS (separate concern)

DNS changes are independent of code deploys. If a bad DNS change was applied:

```bash
# With the old VPS IP, re-run dns-apply with an override
FREDO_VPS_IPV4=<old-ip> HOSTINGER_API_TOKEN=... /opt/the-pauli-effect/clients/fredo3d/scripts/dns-apply.sh
```

DNS TTL is 3600s; expect up to ~1h for full reversion.

## What rollback does NOT do

- ❌ Does not revert the `.env` (use `restore.sh` for that).
- ❌ Does not revert Postgres schema (a forward migration may need a manual down-migration).
- ❌ Does not delete the failed-forward commit from `main`.
- ❌ Does not notify anyone — pair with monitoring (Uptime Kuma) to detect regressions early.

## Verification after rollback

```bash
# Local stack
/opt/the-pauli-effect/clients/fredo3d/scripts/healthcheck.sh

# Public (post-DNS-cutover only)
/opt/the-pauli-effect/clients/fredo3d/scripts/healthcheck.sh --public
```

Both must report HEALTHY before declaring the rollback complete.
