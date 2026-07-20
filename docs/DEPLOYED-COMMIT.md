# DEPLOYED-COMMIT — FREDO 3D

> Populated automatically by `infra/vps/deploy.sh` on every successful deploy.
> Until the first VPS deploy runs, this file records the **intended** first-production commit (the head of `main` at the time the deployment artifacts were prepared).

## First production deploy (target)

| Field | Value |
|---|---|
| Branch | `main` |
| Target SHA | `1a6ec7a89eb31d5a2c6cec0dd8911fe47137bbb3` |
| Commit message | `feat(web): FREDO 3D v1 site — cinematic home, gallery, artwork pages, intakes, bilingual blog, PRD docs` |
| Prepared (UTC) | `2026-07-19T20:38:05Z` |
| Deployed (UTC) | _pending first VPS deploy_ |

## How this file is maintained

- On every successful `deploy.sh`, the script overwrites this file with the
  deployed SHA, branch, timestamp, and previous SHA.
- `rollback.sh` also updates it to the rollback target.
- The latest known-good SHA is mirrored at
  `/opt/pauli-effect/clients/fredo3d/logs/.last_good_sha` for automation.

## After the first real deploy

This section will be replaced by an entry like:

```
- date (UTC): 2026-07-21T03:42:11Z
- sha: <actual deployed sha>
- branch: main
- previous sha: <previous or none>
- commit: <commit subject>
```
