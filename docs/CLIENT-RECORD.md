# CLIENT RECORD — FREDO 3D

> Source of truth for project ownership, hosting, and access. No secrets in this file — ever.

## Parties

| Role | Name |
|---|---|
| **Agency / Owner** | THE PAULI EFFECT |
| **Client / Brand** | FREDO 3D |
| **Artist** | Wladimir Inostroza |
| **Project** | FREDO 3D artist platform |

## Public identity

| Item | Value |
|---|---|
| Primary domain | `fredo3d.com` |
| WWW | `www.fredo3d.com` (permanent redirect to apex) |
| CMS subdomain | `cms.fredo3d.com` (v1: holding page; v2: Payload admin) |
| Canonical site | https://fredo3d.com |
| Public site | https://fredo3d.com |
| CMS admin (v2) | https://cms.fredo3d.com/admin |
| WhatsApp (CTA) | +56 9 9383 8223 (`56993838223`) |

## Source control

| Item | Value |
|---|---|
| Repository | https://github.com/executiveusa/fredo-3D |
| Default branch | `main` |
| Owner | THE PAULI EFFECT (GitHub: `executiveusa`) |

## Hosting

| Item | Value |
|---|---|
| Provider | Hostinger VPS |
| Plan | KVM 2 (2 vCPU / 8 GB RAM / 100 GB disk) |
| OS / template | Ubuntu 24.04 with Coolify |
| Hostname | `srv1099662.hstgr.cloud` |
| IPv4 | `31.220.58.212` |
| IPv6 | `2a02:4780:10:f73a::1` |
| Reverse proxy | Caddy (managed by Coolify) |
| Container runtime | Docker (via Coolify) |
| Provisioned | 2025-11-01 |

## Architecture (v1 — static-first)

```
            fredo3d.com / www.fredo3d.com / cms.fredo3d.com
                              │
                              ▼
                 Caddy (Coolify proxy, :80/:443)
                              │
              ┌───────────────┼─────────────────┐
              ▼                                 ▼
        fredo3d-web:3000                 fredo3d-cms-hold:80
        (Next.js 15 standalone)          (nginx holding page)
```

- **Public site**: Next.js 15 standalone Docker image. Zero application secrets.
- **cms.fredo3d.com (v1)**: nginx holding page. Payload CMS does not yet exist in the repo and will ship in v2 (see DEPLOYMENT.md).
- **Postgres**: not deployed in v1. Volume `fredo3d_postgres_data` is reserved.

## Service inventory

| Service | Container | Image | Port | Status |
|---|---|---|---|---|
| Web | `fredo3d-web` | `fredo3d-web:latest` | 3000 (loopback) | ✅ v1 |
| CMS-hold | `fredo3d-cms-hold` | `nginx:1.27-alpine` | 3001 → 80 | ✅ v1 (placeholder) |
| Content studio | `fredo3d-content` | (future) | 3001 | ⏳ v2 |
| PostgreSQL | `fredo3d-postgres` | (future) | 5432 (internal) | ⏳ v2 |

## Backup location & schedule

| Item | Value |
|---|---|
| Path | `/opt/pauli-effect/clients/fredo3d/data/backups/YYYY-MM-DD/` |
| Schedule | daily at 03:17 UTC (cron) |
| Retention | 14 days |
| Contents | postgres dump (v2) · media · config · `.env` (chmod 600) · git bundle |
| Verification | `backup.sh` aborts on empty dump; manual restore tested via `restore.sh` |

## Admin URLs

| Surface | URL |
|---|---|
| Public site (ES) | https://fredo3d.com/es |
| Public site (EN) | https://fredo3d.com/en |
| Gallery | https://fredo3d.com/es/galeria |
| Blog | https://fredo3d.com/es/blog |
| Commissions | https://fredo3d.com/es/encargos |
| Sitemap | https://fredo3d.com/sitemap.xml |
| Robots | https://fredo3d.com/robots.txt |
| CMS holding | https://cms.fredo3d.com |
| CMS admin (v2) | https://cms.fredo3d.com/admin |
| Hostinger panel | https://hpanel.hostinger.com |
| GitHub repo | https://github.com/executiveusa/fredo-3D |

## Ownership notes

- **THE PAULI EFFECT** owns the deployment architecture, infrastructure code, and operational runbooks under `infra/`, `docs/`, and `/opt/pauli-effect/clients/fredo3d/`.
- **FREDO 3D (Wladimir Inostroza)** owns all artwork, biography, and editorial content. Artwork masters are never modified by automation (`.studio/AGENT-RULES.md`).
- Public site code defaults to **zero application secrets** — payments, merch, CMS, and AI integrations are adapter-driven and disabled by default.
- No secrets are stored in Git. All runtime secrets live in `/opt/pauli-effect/clients/fredo3d/config/.env` (chmod 600, root-owned).

## Operational contacts

> Populate with real names/emails before handover. Placeholder format only.

| Role | Contact |
|---|---|
| Operations lead (THE PAULI EFFECT) | _TBD_ |
| Artist / content owner (FREDO 3D) | _TBD_ |
| Hostinger support | https://www.hostinger.com/support |

## Change log

| Date (UTC) | Change |
|---|---|
| 2026-07-19 | Client record created; v1 architecture documented; infra scripts authored. |
