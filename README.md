# FREDO 3D

Greenfield cinematic artist-world prototype for Chilean artist **FREDO 3D (Wladimir Inostroza)**.

This repository is built under a staged, evidence-first design harness.

## Start here

For humans and agents:

1. Read `AGENTS.md`.
2. Read `CLAUDE.md` when using Fable/Claude Code.
3. Run the local harness:

```bash
bash scripts/fredo-studio.sh bootstrap
bash scripts/fredo-studio.sh doctor
bash scripts/fredo-studio.sh inspect
```

Optional on macOS/Linux/WSL:

```bash
chmod +x scripts/fredo-studio.sh
./scripts/fredo-studio.sh doctor
```

## Required build order

```text
inspect
→ grill one unresolved question at a time
→ deep verified research
→ PRD/story/design constitution
→ HUMAN APPROVAL
→ standalone HTML prototypes
→ HUMAN VISUAL APPROVAL
→ bounded production slices
→ independent review
→ zero-secret QA
→ HUMAN PRODUCTION APPROVAL
→ deploy
```

## Token-efficient development

Use jCodeMunch when available for targeted repository intelligence rather than broad file reads.
Use RTK when available to compress noisy git/build/test/search output.
Neither is a production runtime dependency.

## Default technical rule

A fresh clone must eventually build in its default public mode with **zero application secrets**.
Payments, commerce APIs, CMS, chatbot providers, analytics and publishing integrations are optional adapters added later.

## Design evidence required before production implementation

Planning:
- `docs/PRD.html`
- `docs/PRD.md`
- `docs/DESIGN-CONSTITUTION.html`
- `docs/STORY-MAP.html`
- `docs/COMMERCE-MODEL.md`
- `docs/CINEMATIC-COMPONENT-AUDIT.html`

Visual prototypes:
- `design/story-prototype.html`
- `design/gallery-prototype.html`
- `design/intake-prototype.html`
- `design/motion-prototype.html`

See `.studio/` for governance and quality gates.
