# FREDO 3D — Decision Ledger

Grill-phase decisions. One question at a time, human-answered. Later phases must
not contradict entries here without a new dated entry superseding the old one.

| # | Date | Question | Human answer | Resulting rule |
|---|------|----------|--------------|----------------|
| 1 | 2026-07-19 | Which of the 15 supplied artworks are currently available for purchase as physical originals? | Unknown | All artworks launch with `availability: "unknown"`. No prices, no "for sale" labels. Every piece shows "Hacer una oferta" and WhatsApp inquiry. Availability data can be added later in the manifest/CMS without rebuilding. |
| 2 | 2026-07-19 | Has Fredo approved any artworks for reproduction — prints or merchandise? | No | Every artwork: `reproductionApproved: false`, `merchandiseApproved: false`. Merch section ships disabled/catalog mode only. Nothing purchasable, no print derivatives generated. Approval later = data flip, not rebuild. |
| 3 | 2026-07-19 | Production domain? | fredo3d.com | Use `fredo3d.com` in all env/SEO/deployment config. Content studio: `content.fredo3d.com`. |
| 4 | 2026-07-19 | Book relationship? | Author AND illustrator of isla.de.plastico book | Book section presents Fredo as author+illustrator. Purchase details still need verification during research before any buy link. |
| 5 | 2026-07-19 | Personal photos of Fredo? | No personal pics until later | Chapter 06 (THE HUMAN) uses name + verified bio only, art-derived visuals. Photo slot exists in CMS, empty at launch. |
| 6 | 2026-07-19 | Sound? | Wire for sound, launch silent | Audio architecture built in (per-chapter audio slots, mute toggle, reduced-motion/audio respect) but zero audio assets shipped. Adding sound later = asset upload, no code change. |
| 7 | 2026-07-19 | Commissions/murals/travel? | Yes. Airfare + lodging paid by client as part of package. Inquire for details. Premium/luxury positioning. | Commission/mural intakes state travel costs (airfare + lodging) are client-paid, "inquire for details". Positioning: premium, collector-grade presentation. NOTE: fame claims must stay verifiable — luxury feel comes from design, tone, and verified achievements, never invented press/awards (master prompt law 14). |
| 8 | 2026-07-19 | Inquiry routing? | WhatsApp AND email, simultaneously | Form submissions: stored in CMS inbox + WhatsApp deep-link handoff + email notification once EMAIL_PROVIDER enabled. Until then CMS + WhatsApp. |
| 9 | 2026-07-19 | Language handling? | Fredo speaks both | Forms/contact points tell clients they may write in Spanish or English. No language warning needed. |
| 10 | 2026-07-19 | Content/assistant authority? | Build PopeBot as Fredo's proactive digital manager | See `docs/ASSISTANT-REQUIREMENTS.md`. Fredo has final approval on ALL commands; bot proposes, human approves. |
