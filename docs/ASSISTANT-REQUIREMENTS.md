# PopeBot — Fredo's Digital Manager (Requirements)

Captured 2026-07-19 from owner decisions (ledger Q10). Feeds the PRD. Built at
Slice 9 per the gated build order — NOT before design gates pass.

## Identity

- "Soy el asistente digital de FREDO 3D." Never impersonates Fredo.
- Proactive assistant + business manager, not just a chat widget.
- **Fredo holds final approval on every command.** Bot proposes → human approves → bot executes. No autonomous publishing, purchasing, store changes, or messaging.

## Base

- Fork/adapt https://github.com/stephengpope/thepopebot.git (inspect, don't blindly copy — master prompt §17).
- Runs on the VPS beside the content studio, never on the public frontend.

## Model layer — OmniRoute

- Vendor: OmniRoute v3.8.49 (diegosouzapw/OmniRoute), extracted at `../vendor/OmniRoute-release-v3.8.49` (kept OUT of this repo; vendored properly during Slice 9).
- Purpose: free-tier AI gateway (264 providers, 90+ free) with auto-fallback.
- Requirement: assistant runs on free models by default, switches providers automatically on rate/token limits or errors.

## Context-transfer tool (new build)

When a session nears its model's context/token limit:
1. Auto-summarize session state (task, decisions, pending approvals, working files).
2. Persist to the assistant's store (Payload or local db).
3. Open a fresh session on the next available model (via OmniRoute) seeded with that state.
4. Zero user action required; surface a small "continued on new model" note.

## Capabilities (all approval-gated)

- Write/draft blog posts (drafts only — publishing needs human click, master prompt law 16).
- Upload images to the site via Payload media (Fredo drag-drops, bot handles metadata/derivatives).
- Manage merch: browser control (agent-browser/Playwright) to access Printify, set up stores, sync products — every action previewed to Fredo first, and only for merch-approved artworks (ledger Q2: currently none).
- Draft social content, summarize inquiries, track unanswered leads, qualify offers.
- Never: accept offers, sign licenses, invent provenance, fake checkout, spend money without explicit approval.

## Non-technical UX

- Simple Spanish-first chat + button interface (approve / reject / edit).
- No terminal, no config files exposed to Fredo.
- Every proposed action shown in plain language with a preview before approval.
