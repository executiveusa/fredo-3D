# OWNER HANDBOOK — FREDO 3D

> Plain-language guide for the artist and THE PAULI EFFECT team. No technical jargon assumed. No secrets here.

## The short version

- **Public site**: https://fredo3d.com
- **CMS admin** (when v2 ships): https://cms.fredo3d.com/admin
- **Today (v1)**: cms.fredo3d.com shows a polite "content studio coming soon" page. That's expected.
- The site works with **no manual work** — artwork and blog are already in the code.
- Backups run automatically every night. You don't need to do anything for them.

---

## 1. Where things are

| What | Where |
|---|---|
| Public site | https://fredo3d.com |
| Spanish home | https://fredo3d.com/es |
| English home | https://fredo3d.com/en |
| Gallery (Spanish) | https://fredo3d.com/es/galeria |
| Blog | https://fredo3d.com/es/blog |
| Commissions | https://fredo3d.com/es/encargos |
| WhatsApp number (all CTAs) | +56 9 9383 8223 |
| Source code | https://github.com/executiveusa/fredo-3D |

## 2. How to log in (v2 — Payload CMS, when ready)

1. Go to https://cms.fredo3d.com/admin
2. Use the admin email + password from `config/.env` on the VPS.
3. The first time, Payload may ask you to set up the initial admin user — follow the prompt.

> In v1 there is no admin login because the CMS isn't built yet. This section activates when v2 ships.

## 3. How to add an artwork (v2)

1. Log in to the CMS.
2. Open **Artworks** → **New**.
3. Upload the image (web-resolution JPG/PNG; keep the master separately).
4. Fill in:
   - **Title** (optional — "Untitled" is fine and honest)
   - **Year**, **Medium**, **Dimensions**
   - **Availability**: available / reserved / sold / private collection / unknown
   - **Show in gallery**: yes/no
   - **Categories**: anamorphic / surreal / pencil / painting
5. Save as draft, then **Publish** when ready.
6. The public gallery updates on next site rebuild (or instantly if `CONTENT_PROVIDER=payload`).

> In v1, artworks come from `content/artworks/artwork-manifest.json` in the code. Adding one means editing the JSON — coordinate with THE PAULI EFFECT.

## 4. How to edit a blog post (v2)

1. Log in to the CMS.
2. Open **Posts**.
3. Click the post, edit, save draft or publish.

The 6 existing posts are already in the public site (in the code under `apps/web/lib/blog.ts`). They were ported with:
- Real source publication date (`sourcePublishedAt`)
- Real fredo3d.com publication date (`publishedAt` — never backdated)

**Never backdate a new post.** If you're republishing an old external article, set `sourcePublishedAt` to the original date and `publishedAt` to today.

## 5. How to publish (v2)

In the CMS, any record has a status: `draft` or `published`.

- **Draft** = visitors can't see it.
- **Publish** = appears on the site.

You can also use **Preview** to see a draft before publishing.

## 6. How to mark a work as sold

1. Edit the artwork in the CMS (or JSON in v1).
2. Change **Availability** → `sold` (or `private_collection`).
3. Save/publish.
4. The artwork stays visible (history is part of the value) but shows "Colección privada / Vendida" instead of an offer button.

## 7. How to review inquiries

In v1, every CTA (artwork offer, commission, mural, licensing, collaboration) opens WhatsApp with prefilled text to **+56 9 9383 8223**. Inquiries arrive in your WhatsApp inbox directly. Fredo replies personally in Spanish or English.

In v2, if email notifications are enabled, inquiries may also email the address in `config/.env`. Disable email in `.env` (`EMAIL_PROVIDER=disabled`) if you don't want this.

## 8. How to restart services

If the site is acting up, a clean restart usually fixes it. SSH to the VPS and run:

```bash
docker restart fredo3d-web fredo3d-cms-hold
```

That takes ~10 seconds. If it doesn't help, restart the whole stack:

```bash
docker compose --env-file /opt/pauli-effect/clients/fredo3d/config/.env \
  -f /opt/pauli-effect/clients/fredo3d/app/infra/vps/docker-compose.yml restart
```

If **Caddy/Coolify** is the problem (HTTPS not working, 502s everywhere), don't restart it blindly — call THE PAULI EFFECT first; Coolify manages other apps on the same box.

## 9. How to view logs

```bash
# Last 100 lines of the web app
docker logs --tail 100 fredo3d-web

# Last deploy log
ls -1t /opt/pauli-effect/clients/fredo3d/logs/deploy-*.log | head -1 | xargs less

# Health check result
/opt/pauli-effect/clients/fredo3d/scripts/healthcheck.sh
```

## 10. How backups work

- **Automatic**: every night at 03:17 UTC.
- **Where**: `/opt/pauli-effect/clients/fredo3d/data/backups/YYYY-MM-DD/`
- **Kept**: 14 days.
- **Contains**: code, config, `.env`, (in v2: database + media).
- **Verification**: the backup script refuses to finish if the database dump is empty.

To trigger one manually:

```bash
/opt/pauli-effect/clients/fredo3d/scripts/backup.sh
```

## 11. How to restore

Restoring is interactive and always asks "YES" before touching anything live. See `BACKUP-RESTORE.md` for the full procedure. The short version:

```bash
/opt/pauli-effect/clients/fredo3d/scripts/restore.sh 2026-07-19
```

## 12. How to update from GitHub

When THE PAULI EFFECT pushes a change (new artwork, blog post, fix):

```bash
/opt/pauli-effect/clients/fredo3d/scripts/deploy.sh
```

This pulls the latest from `main` and redeploys. It's safe to re-run; it never force-pushes.

## 13. How to rotate secrets

Secrets live in `/opt/pauli-effect/clients/fredo3d/config/.env` (chmod 600).

To rotate (e.g. the Payload secret, or a payment key):

1. Edit the file as root: `nano /opt/pauli-effect/clients/fredo3d/config/.env`
2. Replace the value.
3. Restart the affected service (or the whole stack — see §8).
4. Run a backup so the new `.env` is captured.

**Never** put secrets in Git. The `.gitignore` already blocks them, but double-check before committing.

## 14. How to disable integrations

Most integrations are **disabled by default** in `.env`:

| Integration | Variable | To disable |
|---|---|---|
| Payments (PayPal/Stripe) | `PAYMENTS_PROVIDER` | `disabled` |
| Merch (Printify) | `MERCH_PROVIDER` | `disabled` |
| AI assistant | `ASSISTANT_PROVIDER` | `local` (= off, just static help text) |
| Email | `EMAIL_PROVIDER` | `disabled` |
| Analytics | `ANALYTICS_PROVIDER` | `disabled` |

After changing any of these, restart the stack (§8).

## 15. When something is broken

In order:

1. Run `healthcheck.sh` — it tells you what's wrong.
2. Try `docker restart fredo3d-web` (most issues are here).
3. Check the deploy log under `logs/`.
4. If a recent deploy caused it: `rollback.sh`.
5. If HTTPS is the problem: leave Caddy alone, call THE PAULI EFFECT.
6. If data is lost: `restore.sh` from the most recent good backup.

## 16. What to never do

- ❌ Don't `docker volume prune` — it deletes data.
- ❌ Don't run `git reset --hard` or `git push --force`.
- ❌ Don't edit secrets in committed files.
- ❌ Don't restart Coolify without checking what else is running on the VPS.
- ❌ Don't expose ports 3000/3001/5432 to the public internet — they're internal by design.
- ❌ Don't redraw Fredo's artwork with AI tools (per `.studio/AGENT-RULES.md`).
