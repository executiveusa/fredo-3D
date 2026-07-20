# FREDO 3D — Product Requirements Document

Status: **APPROVED FOR BUILD** (owner authorized autonomous execution 2026-07-19: "go … finish the site"). Decisions: `docs/DECISION-LEDGER.md`. Facts: `research/CLAIMS.json`.

## 1. Product

Cinematic bilingual (es-first) artist world for FREDO 3D (Wladimir Inostroza, Chile). Not a portfolio template — an entry into his anamorphic/surreal universe that converts visitors into: original-art offers, commissions, murals, licensing inquiries, merch interest (catalog mode), book interest, WhatsApp conversations.

## 2. Users

1. Collectors (originals, offers) — primary revenue.
2. Commission/mural clients incl. international luxury clients (client pays airfare + lodging).
3. Licensing/brand partners.
4. Fans/press → blog archive, social.

## 3. Architecture

- `apps/web` — Next.js App Router, Vercel, static content mode, ZERO secrets. Fails gracefully without backend.
- `apps/content-studio` — Payload CMS + PostgreSQL on VPS (phase 2; env templates ready in repo).
- Content truth in repo: `content/artworks/artwork-manifest.json`, `content/blog/*`, `research/*`.
- Providers all disabled at launch: payments, merch, email, analytics. Assistant local.

## 4. Routes (v1)

```
/es (root redirects to /es)         /en
/es/galeria                         /en/gallery
/es/obra/[id]                       /en/artwork/[id]
/es/blog, /es/blog/[slug]           /en/blog, /en/blog/[slug]
/es/encargos (intake hub)           /en/commissions
/es/contacto                        /en/contact
sitemap.xml, robots.txt
```

## 5. Home chapters (from master prompt §8, verified copy only)

01 THRESHOLD — paper white, "FREDO 3D / Entre el papel y lo imposible"
02 THE LINE LEAVES THE PAGE — anamorphic origins (obra-03, obra-05, obra-10)
03 INSIDE THE IMPOSSIBLE — surreal works (obra-04, obra-09, obra-15)
04 THE WORLDS INSIDE — painterly/dream (obra-08, obra-16, obra-11)
05 THE HUMAN — verified bio (STORY-DRAFT.md), no photo, TVN persona quote
06 THE ARCHIVE — press timeline 2010→now + gallery CTA
07 OWN PART OF THE WORLD — offers (no prices; availability unknown)
08 BRING FREDO INTO YOUR WORLD — commissions/murals/licensing, travel terms
09 FINAL INVITATION — gallery, WhatsApp, blog

## 6. Commerce rules (ledger-bound)

- No prices anywhere (Q1 unknown). CTA = "Hacer una oferta" / WhatsApp / inquiry forms.
- No buy buttons, no checkout, no fake success states.
- Merch = FREDO OBJECTS teaser only (Q2: nothing approved; catalog/disabled).
- Book section: author+illustrator statement only; no purchase link (unverified).
- Intakes: offer, commission, mural (travel = client pays airfare+lodging, "inquire for details"), licensing, collaboration. Submissions → WhatsApp deep link + mailto fallback (static mode has no server).

## 7. Content rules

- Every biographical statement traceable to CLAIMS.json. No ages/birth year.
- Blog archival posts: `sourcePublishedAt` = original date, `publishedAt` = real site date. Never backdated.
- Artwork metadata: unknown stays unknown. obra-01 and obra-07 EXCLUDED from gallery (provenance unconfirmed). obra-14 reserved as merch evidence.
- Alt text grounded in visible content (in manifest, es+en).

## 8. Quality gates

Krug usability (`.studio/KRUG-GATE.md`), reduced-motion fallback for every effect, keyboard nav, semantic HTML, no scroll hijack, no autoplay sound (wired-but-silent per Q6), mobile-first performance, `next build` green with zero env vars.

## 9. Out of scope v1 (deferred, documented)

Payload deployment (VPS access needed), PayPal/Stripe/Printify adapters, PopeBot assistant (Slice 9; `docs/ASSISTANT-REQUIREMENTS.md`), social engine automation, hi-res image pipeline (masters are web-res — need originals from Fredo).
