# DEPLOYMENT — FREDO 3D

> Production deployment reference. Companion to `CUTOVER-RUNBOOK.md` (the step-by-step) and `VPS-OPERATIONS.md` (day-2 ops).

## Current state

**v1 — static-first.** Public Next.js site live; CMS subdomain serves a branded holding page; Payload/Postgres reserved for v2.

| Capability | v1 status |
|---|---|
| Public bilingual site (es/en) | ✅ live after cutover |
| Gallery, artwork pages | ✅ |
| Blog (6 verified bilingual posts) | ✅ |
| WhatsApp CTAs (56993838223) | ✅ |
| Sitemap / robots | ✅ |
| HTTPS (Let's Encrypt via Caddy) | ✅ after cutover |
| Backups (daily, 14d retention) | ✅ after first cron |
| `cms.fredo3d.com` Payload admin | ⏳ v2 (holding page in v1) |
| Postgres | ⏳ v2 |
| Payments / merch / AI | disabled by design |

## Stack

| Layer | Choice | Rationale |
|---|---|---|
| Frontend | Next.js 15 (`output: 'standalone'`) | matches repo, zero-secret default |
| Container | Docker (multi-stage alpine image) | small attack surface |
| Reverse proxy | Caddy (via Coolify) | already running on VPS, automatic HTTPS |
| Host OS | Ubuntu 24.04 + Coolify | existing VPS template |
| DNS | Hostinger API | fredo3d.com is in the Hostinger portfolio |
| Backups | shell + cron | no extra services |

## Repository layout (deploy-relevant)

```
fredo-3D/
├── apps/web/                  # Next.js app
│   ├── Dockerfile             # multi-stage standalone build
│   ├── .dockerignore
│   └── next.config.ts         # output: 'standalone'
├── content/artworks/          # artwork manifest + masters (read by web build)
├── infra/vps/
│   ├── docker-compose.yml     # web + cms-hold (fredo3d-network)
│   ├── Caddyfile              # full standalone (DR / direct-Caddy use)
│   ├── Caddyfile.fragment     # drop-in for Coolify/existing Caddy
│   ├── deploy.sh              # fast-forward deploy + smoke test
│   ├── rollback.sh            # revert to last good sha
│   ├── backup.sh              # daily backup (cron)
│   ├── restore.sh             # interactive restore
│   ├── healthcheck.sh         # local + optional --public probes
│   ├── dns-apply.sh           # Hostinger API DNS cutover
│   ├── .env.example           # safe-to-commit template
│   └── cms-hold/              # nginx holding page for cms.fredo3d.com
└── docs/                      # this + companion docs
```

## VPS directory layout (on the box)

```
/opt/the-pauli-effect/clients/fredo3d/
├── app/            # git clone of executiveusa/fredo-3D
├── config/
│   └── .env        # chmod 600, root-owned — NEVER committed
├── data/
│   ├── postgres/   # (v2) Postgres datadir volume
│   ├── media/      # (v2) uploaded artwork media
│   └── backups/    # daily backup target (14d retention)
├── logs/           # deploy/backup/health/rollback logs + anchors
└── scripts/        # symlinks to infra/vps/*.sh
```

## Cutover overview (high level)

1. SSH to the VPS as root (or sudo-capable user).
2. Create the directory tree and clone the repo (see CUTOVER-RUNBOOK.md §1).
3. Populate `/opt/the-pauli-effect/clients/fredo3d/config/.env` (chmod 600).
4. Wire Caddy (via Coolify proxy UI or by importing the fragment).
5. Run `deploy.sh` — builds image, brings up containers, smoke-tests.
6. Run `dns-apply.sh` from anywhere with the Hostinger token — points `fredo3d.com`, `www`, `cms` at `31.220.58.212`.
7. Wait for DNS propagation, then verify `https://fredo3d.com`.
8. Set up the daily backup cron.

## CSP — staged introduction

v1 ships **without** a Content-Security-Policy header. Next.js inline scripts require a nonce-aware CSP, and adding one blind risks breaking the site. Plan:

1. **v1.0** — ship with HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options only.
2. **v1.1** — instrument `report-uri` / Report-To and collect violations for one week.
3. **v1.2** — promote to enforced CSP once clean.

## v2 — adding Payload CMS (when ready)

`apps/content-studio` currently contains only a `.env.example`. When the real Payload implementation lands:

1. Add a `postgres` service and a `content-studio` service to `docker-compose.yml`.
2. Replace the `cms-hold` route in `Caddyfile`/fragment with `reverse_proxy fredo3d-content:3001`.
3. Flip `CONTENT_PROVIDER=static → payload` in `.env` and rebuild the web image.
4. Initialize Payload admin and seed collections.
5. Add a Postgres dump step (already wired in `backup.sh`, dormant in v1).
6. Update this doc and `OWNER-HANDBOOK.md`.

## Environments

| Env | Where | Notes |
|---|---|---|
| Production | VPS (`31.220.58.212`) | this document |
| Preview | local dev (`npm run dev` in `apps/web`) | zero-secret |
| Legacy | Vercel | historical only; do NOT point DNS here once VPS is canonical |

## Rollback & disaster recovery

- See `ROLLBACK.md` for in-place rollback.
- See `BACKUP-RESTORE.md` for full disaster recovery from `data/backups/<date>/`.
- `data/backups/<date>/repo.bundle` is a full git clone — sufficient to rebuild the entire app from scratch on a fresh VPS.
