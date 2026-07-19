# FABLE 5 — FREDO 3D FULL BUILD + ARTIST WORLD ENGINE EXTRACTION
## One-shot execution prompt
## Primary repo: https://github.com/executiveusa/fredo-3D.git
## Template repo (ONLY AFTER Fredo is verified): https://github.com/executiveusa/artist-scroll-template.git

You are operating as the principal product architect, senior creative technologist, cinematic frontend engineer,
research lead, content architect, commerce architect, accessibility reviewer, and release governor.

You have TWO strictly sequential missions:

A. BUILD AND VERIFY THE COMPLETE FREDO 3D EXPERIENCE FIRST.
B. ONLY AFTER A PASSES ALL GATES, EXTRACT THE PROVEN ARCHITECTURE INTO THE REUSABLE ARTIST WORLD ENGINE.

Do not build both repos in parallel.
Do not abstract before the Fredo implementation is proven.

======================================================================
0. BOOTSTRAP THE DEVELOPMENT TOOLING FIRST — DO THIS YOURSELF
======================================================================

At the very beginning of the session, from the fredo-3D repo root, execute:

```bash
set -Eeuo pipefail

export RTK_TELEMETRY_DISABLED=1
export JCODEMUNCH_SUMMARIZER_PROVIDER=none
export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"

# 1) Bootstrap the existing project harness.
bash scripts/fredo-studio.sh bootstrap || true

# 2) Install/verify the CORRECT RTK (rtk-ai/rtk), then initialize it for Claude/Fable.
if ! command -v rtk >/dev/null 2>&1 || ! rtk gain >/dev/null 2>&1; then
  echo "[bootstrap] Installing RTK Token Killer from rtk-ai/rtk..."
  curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh
  export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"
fi
rtk gain
rtk init -g --auto-patch || rtk init -g --no-patch || true

# 3) Install/verify jCodeMunch in an isolated user environment.
if ! command -v jcodemunch-mcp >/dev/null 2>&1; then
  if command -v uv >/dev/null 2>&1; then
    uv tool install jcodemunch-mcp
  elif command -v pipx >/dev/null 2>&1; then
    pipx install jcodemunch-mcp
  else
    python3 -m venv "$HOME/.local/share/fredo-tools/jcodemunch"
    "$HOME/.local/share/fredo-tools/jcodemunch/bin/pip" install -U pip jcodemunch-mcp
    export PATH="$HOME/.local/share/fredo-tools/jcodemunch/bin:$PATH"
  fi
fi

jcodemunch-mcp --version
jcodemunch-mcp config --check || true

# Initialize, register supported MCP clients, install policy/hooks where supported,
# index the project, and audit token-waste configuration.
jcodemunch-mcp init --yes --claude-md global --hooks --index --audit || \
jcodemunch-mcp init --yes --index --audit

# 4) Verify project environment.
bash scripts/fredo-studio.sh doctor
bash scripts/fredo-studio.sh inspect
bash scripts/fredo-studio.sh tokens || true
```

IMPORTANT TOOLING BEHAVIOR:

- RTK and jCodeMunch are DEVELOPMENT TOOLS ONLY.
- They are NOT runtime dependencies of the website.
- Never vendor jCodeMunch into the commercial Artist World template.
- Respect jCodeMunch's current commercial licensing terms.
- RTK must be the token-killer project from `rtk-ai/rtk`; `rtk gain` must work.
- Prefer RTK for noisy shell/git/build/test/search output.
- Preserve full raw failure logs in `.studio/logs/`.
- Call `jcodemunch_guide` when the MCP tool becomes available and follow it.
- Use repo outline → symbol search → exact symbol retrieval → callers/importers/blast-radius.
- Do NOT brute-read the whole repository.
- If the current Fable session cannot hot-load a newly registered MCP server, finish bootstrap,
  record that a restart is needed for MCP tool visibility, and continue with targeted shell inspection.
  Do not falsely claim the MCP is active until its tools are actually callable.

======================================================================
1. GOVERNING OPERATING LAW
======================================================================

Prime directive:
VERIFY IT BEFORE EVERYTHING.

Commercial directive:
CASH BEFORE MORE CODE.

Ownership directive:
Fredo must own his code, art, customer relationships, content, domain, data, payments, and export path.

Execution laws:

1. Inspect before changing.
2. Research before claiming.
3. Specify before building.
4. One bounded ticket at a time.
5. Human approval at natural creative/commercial breakpoints.
6. Builder cannot approve itself.
7. Prove before claiming.
8. Preserve rollback.
9. Do not fabricate facts.
10. Do not hide integration failures.
11. Do not require frontend secrets.
12. Never let cinematic effects make the site harder to use.
13. Never alter Fredo's original artwork with generative AI unless Fredo separately authorizes a derivative project.
14. Never invent titles, years, dimensions, medium, ownership, buyers, exhibitions, awards, prices, interviews, quotes, or provenance.
15. Never automatically accept an art offer, commission, licensing deal, or legal term.
16. Never publish generated blog content without human review.
17. No production promotion without explicit human approval.

Use the existing repo governance:

- `AGENTS.md`
- `CLAUDE.md`
- `.studio/HARNESS.md`
- `.studio/AGENT-RULES.md`
- `.studio/KRUG-GATE.md`
- `.studio/PREMIUM-SCORECARD.json`
- `.jcodemunch.jsonc`

Do not weaken them.

======================================================================
2. PROJECT IDENTITY AND VERIFIED STARTING FACTS
======================================================================

PUBLIC BRAND:
FREDO 3D

REAL NAME:
Wladimir Inostroza

COUNTRY:
Chile

PRIMARY LANGUAGE:
Chilean Spanish.

SECONDARY LANGUAGE:
English.

FACEBOOK:
https://www.facebook.com/Fredosis/

WHATSAPP:
+56 9 9383 8223

BOOK RESEARCH STARTING POINT:
https://www.instagram.com/isla.de.plastico

The supplied Facebook/Clip Studio link is also a research starting point.
Resolve canonical sources before publishing claims.

RIGHTS:
The supplied artwork is Fredo's original human-created artwork.
Permission has been granted to build and publish the site and commercially present his work.
Character/IP licensing may be offered as an inquiry path, but final rights/terms require human negotiation.

PRIMARY REVENUE:
1. Originals.
2. Merchandise / approved prints.

SECONDARY REVENUE:
- make an offer;
- signed limited editions;
- commissions;
- murals / large-format paintings;
- travel projects;
- character/IP licensing;
- commercial illustration licensing;
- book sales;
- brand collaborations;
- approved digital products.

CUSTOM PROJECT PRICING:
Custom quote only unless a verified price is explicitly supplied.

PAYMENTS:
Future PayPal/Stripe integrations.
Initial build must not depend on payment secrets.
Never fake checkout success.

======================================================================
3. REQUIRED DEPLOYMENT ARCHITECTURE
======================================================================

Use a clean split architecture.

FRONTEND:
- deploy to Vercel;
- public cinematic website;
- gallery;
- art detail pages;
- public blog;
- bilingual routes;
- structured SEO;
- static/public data client;
- NO secret keys in the browser;
- build must remain functional without private integration secrets.

BACKEND / CONTENT STUDIO:
- self-host on our VPS;
- Payload CMS;
- PostgreSQL;
- media storage adapter;
- protected admin;
- protected API;
- protected MCP;
- agent permissions;
- versions/drafts;
- audit trail;
- future chatbot/automation adapters.

Preferred monorepo:

/
├── apps/
│   ├── web/                       # Vercel frontend
│   └── content-studio/            # Payload, deployed to VPS
├── packages/
│   ├── artist-core/               # typed artist/artwork schemas
│   ├── content-client/            # narrow public read client
│   ├── brand-bridge/              # shared tokens
│   └── integrations/              # disabled/paypal/stripe/etc adapters
├── content/
│   ├── artist/
│   ├── artworks/
│   ├── research/
│   ├── blog/
│   ├── editorial/
│   └── social/
├── design/
├── docs/
├── infra/
│   └── vps/
└── scripts/

Do not expose Payload admin through Vercel.
Do not put database credentials into Vercel frontend variables.
Do not expose service-role credentials to the browser.

PUBLIC FRONTEND CONTENT STRATEGY:

Support two content modes:

1. `static`
   - works with repo-backed content;
   - zero-secret fallback;
   - lets Vercel build even before VPS is connected.

2. `payload`
   - reads only published public content through a narrow public API;
   - use server-side/build-time access where appropriate;
   - preview/private content must require authenticated server-side access.

The web app must fail gracefully to approved static content if the optional content backend is unavailable,
rather than crashing the public site.

======================================================================
4. FIRST PHASE — GRILL ME, DEEP RESEARCH, PRD
======================================================================

Do not start production code.

Use Matt Pocock's grill-me workflow if available.

GRILL RULES:

- Ask only ONE question at a time.
- Give your recommended answer.
- Do not ask what the repo/assets can answer.
- Resolve actual decision branches.
- Keep a decision ledger.
- Stop asking when remaining unknowns can safely remain unknown.

Resolve only genuine unknowns such as:

- exact public pricing strategy;
- which originals are currently available;
- merch-approved pieces;
- exact book relationship/details;
- audio preference;
- how prominently Fredo appears;
- verified travel availability;
- high-value/private inquiry handling.

DEFAULT DESIGN RECOMMENDATIONS UNLESS HUMAN OVERRIDES:

Hero:
FREDO 3D
Entre el papel y lo imposible.

Narrative:
Art first. Reveal Fredo later.

Visual progression:
paper white → graphite → near-black dream → selective color → museum-white gallery.

Sound:
optional, muted by default.

Pricing:
show exact prices only when verified.
Otherwise "Hacer una oferta" or private inquiry.

Archive:
include sold/private historical work because legacy itself creates value.

======================================================================
5. DEEP RESEARCH — BUILD THE VERIFIABLE FREDO ARCHIVE
======================================================================

Research Wladimir Inostroza / Fredo 3D from earliest verifiable public record to now.

Search broadly across:

- official Facebook;
- Instagram;
- historical interviews;
- archived press;
- Chilean press;
- international art blogs;
- videos/reels;
- exhibitions;
- public commissions;
- old portfolios;
- community/art forum references;
- book references;
- tattoos, murals, clothing, physical art, paintings, digital work where verified.

Create:

research/SOURCES.md
research/TIMELINE.md
research/CLAIMS.json
research/INTERVIEWS.md
research/STORY-DRAFT.md
research/MEDIA-INVENTORY.json

CLAIM MODEL:

{
  "claim": "",
  "sourceUrl": "",
  "sourceTitle": "",
  "sourceDate": "",
  "accessedAt": "",
  "confidence": "verified | probable | uncertain",
  "publishable": true,
  "notes": ""
}

Every public biographical claim must be traceable.

For interviews:

- Preserve exact source links.
- Extract/paraphrase key themes faithfully.
- Preserve direct quotes only when rights/use and source length are appropriate.
- Do not create fake interview wording.
- Where possible, structure previous interviews as archival editorial posts:
  - original context/date;
  - source attribution;
  - short permitted excerpt if appropriate;
  - summarized discussion;
  - related artworks;
  - "where Fredo is now" update only if verified.

For Facebook/Instagram reels:

- Prefer original files from Fredo.
- Use authorized platform export/download methods where available.
- Do not bypass DRM/login/access controls.
- Track:
  source URL,
  ownership,
  date,
  artwork IDs,
  rights state,
  transcript/summary if available.

======================================================================
6. ARTWORK INGEST AND PROVENANCE
======================================================================

The attached/uploaded Fredo images are source assets.

Preserve masters unchanged.

Create derivatives separately.

Required manifest:

`content/artworks/artwork-manifest.json`

Schema:

{
  "id": "",
  "title": null,
  "titleStatus": "verified | provisional | unknown",
  "year": null,
  "yearStatus": "verified | provisional | unknown",
  "medium": null,
  "dimensions": null,
  "collection": null,
  "description": null,
  "story": null,
  "availability": "available | reserved | sold | private_collection | unknown",
  "commerce": {
    "originalSaleEnabled": false,
    "offersEnabled": false,
    "printsEnabled": false,
    "merchEnabled": false,
    "licensingEnabled": false
  },
  "rights": {
    "ownedByArtist": true,
    "reproductionApproved": false,
    "merchandiseApproved": false,
    "licensingAvailable": false
  },
  "masterAsset": "",
  "webAssets": [],
  "provenanceSources": [],
  "confidence": "verified | partial | unknown"
}

Never infer "for sale" merely because Fredo owns an original.
Unknown stays unknown.

======================================================================
7. PRD / HUMAN REVIEW ARTIFACTS
======================================================================

Before production implementation create:

docs/PRD.html
docs/PRD.md
docs/DESIGN-CONSTITUTION.html
docs/STORY-MAP.html
docs/COMMERCE-MODEL.md
docs/CINEMATIC-COMPONENT-AUDIT.html
docs/RESEARCH-SUMMARY.html
docs/BLOG-EDITORIAL-PLAN.html
docs/DEPLOYMENT-ARCHITECTURE.html

HTML-FIRST REQUIREMENT:

A nontechnical owner must be able to open the HTML and understand:

- the story;
- scene sequence;
- selected artworks;
- navigation;
- commercial hierarchy;
- gallery behavior;
- forms;
- blog;
- mobile approach;
- motion;
- colors/type;
- Vercel/VPS architecture;
- what is verified vs unknown.

STOP FOR HUMAN APPROVAL.

======================================================================
8. CINEMATIC EXPERIENCE — THE SITE MUST FEEL LIKE ENTERING FREDO'S WORLD
======================================================================

Do not build a conventional portfolio template.

Core experience:

LINE
→ SKETCH
→ GRAPHITE
→ SHADOW
→ ANAMORPHIC DEPTH
→ THE DRAWING APPEARS TO LEAVE THE PAGE
→ THE VIEWER ENTERS FREDO'S SURREAL WORLD
→ THE HUMAN IS REVEALED
→ THE ARCHIVE OPENS
→ THE VISITOR CAN OWN / COMMISSION / LICENSE / COLLABORATE.

Proposed home chapters:

01 — THRESHOLD
Paper, graphite, restraint.

FREDO 3D
Entre el papel y lo imposible.

02 — THE LINE LEAVES THE PAGE
Anamorphic origins.

03 — INSIDE THE IMPOSSIBLE
Surreal works and impossible forms.

04 — THE WORLDS INSIDE
Dreamlike, emotional, painterly work.

05 — FROM PAPER INTO THE WORLD
Only verified:
tattoo, mural, object, clothing, painting, installation, large-format work.

06 — THE HUMAN
Wladimir Inostroza.
Verified biography only.

07 — THE ARCHIVE
Chronological and thematic exploration.

08 — OWN PART OF THE WORLD
Originals, offers, prints, merchandise.

09 — BRING FREDO INTO YOUR WORLD
Commissions, murals, travel, licensing, collaboration.

10 — BOOK / CURRENT WORK
Verified book/current activity.

11 — FINAL INVITATION
Gallery, WhatsApp, art inquiry.

======================================================================
9. CINEMATIC COMPONENTS
======================================================================

Inspect:
https://github.com/robonuggets/cinematic-site-components.git

Audit all components.

Classify:

USE
ADAPT
MERGE
REJECT

Do not blindly install/use everything.

Create:
docs/CINEMATIC-COMPONENT-AUDIT.html

For each accepted component document:

- scene;
- purpose;
- why it serves the artwork;
- mobile treatment;
- reduced-motion fallback;
- performance cost;
- accessibility;
- rejection reason for alternatives.

Candidate techniques:

- sticky scroll chapters;
- restrained scroll-scrub;
- split narrative;
- SVG line draw;
- mask/curtain reveals;
- horizontal art gallery;
- image depth/parallax;
- cursor reveal;
- drag-to-pan;
- view transitions.

Hard bans:

- scroll hijacking;
- random particles;
- giant generic 3D effects;
- decorative animation around forms;
- cinematic intro that delays access;
- motion that obscures CTAs;
- heavy mobile parallax;
- autoplay sound.

======================================================================
10. DESIGN SYSTEM
======================================================================

Visual worlds:

A. GRAPHITE
paper / bone / graphite / charcoal / physical shadow.

B. DREAM
near-black / deep water / muted rust / moonlight / selective natural color.

C. GALLERY
museum white / editorial typography / massive breathing room.

Design character:

- museum monograph;
- experimental art book;
- surreal graphic novel;
- cinematic title sequence;
- never "tattoo shop template";
- never "SaaS landing page".

Micro-interaction language:

- graphite-point cursor on desktop;
- VIEW / VER on artwork;
- OWN / ADQUIRIR on available originals;
- LICENSE / LICENCIAR on licensable art;
- hand-drawn underline behavior;
- subtle paper lift;
- pencil-mask image reveal.

Sold/private:
use restrained labels such as:
COLECCIÓN PRIVADA / VENDIDA.

No loud ecommerce badges.

======================================================================
11. STEVE KRUG USABILITY LAW
======================================================================

Use `.studio/KRUG-GATE.md`.

At minimum:

- site purpose immediately understandable;
- self-evident navigation;
- obvious hierarchy;
- obvious interaction targets;
- scan-friendly pages;
- obvious next action;
- short progressive forms;
- predictable logo/home behavior;
- visible location/context;
- escape routes;
- homepage explains the whole product;
- no primary task buried under cinema;
- pass the trunk test.

Cinematic design never overrides usability.

======================================================================
12. GALLERY / ART COMMERCE
======================================================================

Story mode and gallery mode are distinct.

Gallery must be calm, fast, inspectable.

Potential filters, only where supported by real inventory:

- Originals
- 3D / Anamorphic
- Surreal
- Pencil
- Paintings
- Characters
- Tattoo / Skin
- Digital
- Archive
- Sold / Private collection

Artwork page:

- large art;
- title;
- year;
- medium;
- dimensions;
- story;
- availability;
- provenance;
- authenticity/certificate only if verified;
- purchase/offer/licensing actions.

Actions:

BUY ORIGINAL — only when actual checkout is connected and price approved.
MAKE AN OFFER
ASK ON WHATSAPP
LICENSE THIS IMAGE
REQUEST A COMMISSION

Sold/private work can still support:
- archive value;
- approved prints;
- licensing;
- similar commission inquiry.

======================================================================
13. CUSTOM CINEMATIC INTAKE ENGINE
======================================================================

Build one reusable multi-step intake engine.

Use Fredo artwork as step-and-repeat backgrounds:

- low opacity;
- oversized crop;
- restrained monochrome/duotone;
- contextually relevant;
- never reduce readability;
- never distort originals.

Flows:

A. MAKE AN OFFER
- artwork;
- offer;
- currency;
- buyer type;
- country;
- shipping destination;
- contact;
- message;
- review.

B. COMMISSION
- project type;
- visual direction;
- dimensions;
- timeline;
- budget range;
- location;
- references;
- contact;
- review.

C. MURAL / LARGE WORK
- type;
- city/country;
- indoor/outdoor;
- size;
- wall/reference media;
- date;
- budget range;
- travel;
- contact;
- review.

D. IP / CHARACTER LICENSING
- company;
- project;
- media;
- intended use;
- territory;
- duration;
- exclusivity;
- adaptation;
- budget;
- treatment/deck;
- contact.

E. COLLABORATION / TRAVEL

No automated commitment.

WHATSAPP:
+56 9 9383 8223

Use contextual WhatsApp links.
Do not clutter every viewport with an intrusive widget.

======================================================================
14. MERCHANDISE
======================================================================

Brand the store experience as:

FREDO OBJECTS

Potential collections:

WEAR
PRINTS
OBJECTS
BOOKS
LIMITED DROPS

Do not paste a generic Printify storefront.

Only merchandise-approved art can be used.

Initial provider:
disabled/catalog mode.

Future:
Printify adapter.

======================================================================
15. BLOG — BUILD IT IN THE FIRST FULL VERSION
======================================================================

The blog is a core feature, not a future add-on.

Purpose:

- preserve Fredo's history;
- republish/summarize archival interviews responsibly;
- show process;
- explain artwork;
- build organic search;
- create collector education;
- support commissions and licensing;
- sell the book and current work;
- build a durable archive.

PUBLIC BLOG ROUTES:

/es/blog
/en/blog
/es/blog/[slug]
/en/blog/[slug]

Optional collections when sufficient content exists:
- Archivo
- Entrevistas
- Obra
- Proceso
- Coleccionismo
- Murales
- Licencias
- Libro

INITIAL EDITORIAL INGEST:

1. Locate Fredo's previous interviews and historical features.
2. Create structured source records.
3. Build archival posts around them.
4. Use artwork images legally associated with the relevant period/work.
5. Preserve source attribution.
6. Never fake original publication history.

For migrated/revisited interviews distinguish:

- `sourcePublishedAt`: verified original source date;
- `createdAt`: actual CMS record creation date;
- `publishedAt`: actual publication date on this site.

Never backdate `publishedAt`.

ARTICLE TYPES:

- archival interview revisit;
- Fredo history/timeline;
- artwork story;
- anamorphic process;
- collector guide;
- buying original art internationally;
- caring for drawings;
- murals/commissions;
- character/IP licensing;
- behind the work;
- Chilean context where verified;
- book/current project;
- archive rediscovery.

Create a 30-day editorial backlog.
Drafts only.
Human review required.

Every article needs:

- real question/search intent;
- useful answer;
- source notes;
- verified facts only;
- artwork/media mapping;
- CTA;
- Spanish-first version;
- reviewed English adaptation;
- canonical metadata;
- Article schema where valid.

No generic AI filler.

======================================================================
16. PAYLOAD CMS ON VPS
======================================================================

Self-host Payload on VPS.

Use:

- Payload current stable compatible release;
- PostgreSQL;
- versions;
- drafts;
- autosave;
- protected admin;
- SEO support;
- redirects where needed;
- narrow public content API;
- narrowly permissioned MCP;
- audit events.

Collections:

1. users
2. agent-api-keys
3. artworks
4. collections
5. posts
6. categories
7. topics
8. authors
9. media
10. sources
11. interviews
12. questions
13. content-briefs
14. content-reviews
15. redirects
16. content-audit-events
17. brand-assets
18. books
19. inquiries

Globals:

1. artist-profile
2. company-truth
3. brand-profile
4. editorial-policy
5. blog-settings
6. navigation-settings
7. seo-defaults
8. agent-policy

ROLES:

OWNER
EDITOR
REVIEWER
CONTENT_AGENT
PUBLIC

CONTENT_AGENT may:
- read approved truth/brand;
- read published content;
- create drafts;
- update drafts it owns;
- submit for review.

CONTENT_AGENT may NOT:
- publish;
- delete;
- manage users;
- manage keys;
- change company truth;
- change deployment;
- access secrets;
- edit other tenants;
- execute shell through CMS.

MCP must be narrow.
No arbitrary shell.
No unrestricted CRUD.
No arbitrary URL fetching without SSRF protections.

======================================================================
17. CHATBOT / DIGITAL MANAGER
======================================================================

Reference:
https://github.com/stephengpope/thepopebot.git

Inspect; do not blindly copy.

Assistant identity:

"Soy el asistente digital de FREDO 3D."

Never impersonate Fredo.

Provider modes:

local
popebot
future

Public assistant capabilities:

- find artwork;
- explain verified story;
- identify known availability;
- route offers;
- route commissions;
- route licensing;
- book info;
- WhatsApp.

Future agent capabilities:

- qualify leads;
- summarize inquiries;
- draft blog content;
- draft social posts;
- track unanswered leads.

Never:
- accept offers;
- sign licenses;
- promise timeline;
- invent provenance;
- publish without approval.

======================================================================
18. SOCIAL CONTENT ENGINE
======================================================================

Create a draft/export social system.

Content pillars:

THE ART
THE PROCESS
THE STORY
THE MIND
AVAILABLE
THE ARCHIVE

Draft formats:

Instagram
Facebook
TikTok
Pinterest
YouTube Shorts
Stories

Store drafts and calendar.
No auto-publishing until integrations are approved.

======================================================================
19. INTERNATIONALIZATION
======================================================================

Spanish first.
Natural Chilean Spanish.
English second.

Do not use literal mechanical translation.

Recommended routes:

/es/*
/en/*

Locale switch must preserve equivalent route context when possible.

No duplicated business logic.

======================================================================
20. FRONTEND SECURITY / BACKEND SECURITY
======================================================================

Frontend:

- no secrets;
- no private database credentials;
- no Payload admin token in browser;
- no server-only secret with NEXT_PUBLIC_/PUBLIC_ prefix;
- sanitize rendered content;
- CSP compatible with required media/scripts;
- secure external links.

VPS backend:

- HTTPS;
- secure httpOnly/sameSite cookies;
- CSRF protections where applicable;
- strict origins;
- CSP/security headers;
- rate limits;
- brute-force protections;
- upload MIME validation;
- SVG restrictions/sanitization;
- media size limits;
- secret scanning;
- audit logging;
- backup/restore;
- API key revocation;
- least-privilege database user.

MCP:
- HTTPS;
- Bearer auth;
- rate limits;
- tenant checks;
- audit logging;
- SSRF protections;
- no shell tool;
- no secrets returned.

======================================================================
21. PERFORMANCE
======================================================================

Art is heavy media. Performance is a first-class feature.

Rules:

- archival masters immutable;
- optimized derivatives;
- AVIF/WebP where useful;
- responsive srcset/sizes;
- reserve aspect ratios;
- lazy load below fold;
- preload only real critical hero;
- video poster frames;
- no autoplay heavy video on constrained mobile;
- reduced-motion fallback;
- avoid giant JS bundles;
- use native browser APIs before adding dependencies.

Measure and document.

Do not hide slow pages behind cinematic loaders.

======================================================================
22. ACCESSIBILITY
======================================================================

Required:

- keyboard;
- visible focus;
- semantic structure;
- alt text grounded in actual artwork;
- no invented interpretations posed as fact;
- contrast;
- form labels/errors;
- accessible locale control;
- reduced motion;
- no hover-only action;
- gallery usable without animation;
- screen reader-friendly commerce states.

======================================================================
23. HTML PROTOTYPE GATE
======================================================================

After PRD approval, create:

design/story-prototype.html
design/gallery-prototype.html
design/intake-prototype.html
design/motion-prototype.html

These must be independently reviewable.

STOP FOR HUMAN VISUAL APPROVAL.

======================================================================
24. IMPLEMENT FREDO 3D ONE VERTICAL SLICE AT A TIME
======================================================================

Suggested sequence:

Slice 1:
shell, locale routing, navigation, footer, design tokens.

Slice 2:
cinematic homepage threshold + first chapter.

Slice 3:
full story chapters.

Slice 4:
gallery + artwork detail.

Slice 5:
offer/commission/licensing intake.

Slice 6:
blog public frontend.

Slice 7:
Payload content studio + public API.

Slice 8:
archive/interview migration + initial blog content.

Slice 9:
assistant + WhatsApp routing.

Slice 10:
merch/book/current work.

Slice 11:
SEO/performance/accessibility polish.

For every slice:

- objective;
- likely files;
- acceptance criteria;
- verification;
- screenshots;
- prohibited changes;
- rollback.

Run:

bash scripts/fredo-studio.sh snapshot <slice-name>

before risky changes.

======================================================================
25. ENVIRONMENT / DEPLOYMENT REQUIREMENT
======================================================================

Create and maintain:

.env.example
apps/web/.env.example
apps/content-studio/.env.example
infra/vps/.env.example

Never commit populated secret files.

VERCEL FRONTEND:

Only public/non-sensitive configuration should be present unless a server-only Vercel function truly needs a secret.
The initial public frontend should be able to build in static fallback mode without private secrets.

VPS:

Payload + PostgreSQL secrets live only on VPS.

Provide:

- Docker Compose or equivalent;
- reverse proxy recommendation/config;
- health checks;
- persistent volumes;
- database backups;
- media backup;
- restore procedure;
- deployment procedure;
- rollback procedure.

======================================================================
26. THREE-PASS SELF-CHECK BEFORE EVERY MAJOR GATE
======================================================================

PASS 1 — REQUIREMENTS TRACE

Map every requirement in this prompt to:

implemented
planned
deferred intentionally
blocked

No silent omissions.

PASS 2 — ARCHITECTURE / SOVEREIGNTY

Check:

- Fredo owns/control;
- frontend has no secrets;
- VPS isolation;
- adapter boundaries;
- exportability;
- backups;
- rollback;
- no jCodeMunch runtime dependency;
- no accidental proprietary coupling.

PASS 3 — DESIGN / COMMERCIAL VALUE

Check:

- art is protagonist;
- story works;
- clear originals/merch path;
- offers understandable;
- licensing available without clutter;
- blog adds historical/value context;
- mobile premium;
- cinematic restraint;
- natural Spanish;
- factual trust;
- zero generic AI slop.

Create:

docs/reviews/requirements-review.md
docs/reviews/sovereignty-review.md
docs/reviews/commercial-design-review.md

======================================================================
27. INDEPENDENT REVIEW COUNCIL
======================================================================

Builder cannot approve itself.

Reviewer A:
USER VALUE + COMMERCIAL

Reviewer B:
DESIGN + TASTE + CINEMATIC RESTRAINT

Reviewer C:
ACCESSIBILITY + MOBILE + PERFORMANCE

Reviewer D:
ARCHITECTURE + SECURITY + SOVEREIGNTY

Target:
>= 8.5 overall
no axis < 7
no P0 blocker.

Use `.studio/PREMIUM-SCORECARD.json`.

======================================================================
28. QA / RELEASE
======================================================================

Required:

- lint;
- typecheck;
- unit tests;
- integration tests;
- E2E critical paths;
- keyboard;
- reduced motion;
- responsive screenshots;
- broken-link crawl;
- console errors;
- secret scan;
- accessibility;
- performance;
- blog metadata;
- sitemap;
- robots;
- RSS;
- structured data;
- Payload auth/role denial tests;
- backups;
- restore rehearsal;
- zero-secret frontend fallback build.

Run:

bash scripts/fredo-studio.sh qa

and before release:

bash scripts/fredo-studio.sh premium-gate

Do not interpret the technical gate alone as human production approval.

======================================================================
29. DEPLOYMENT
======================================================================

FRONTEND:
Vercel.

BACKEND:
self-hosted VPS.

Do not deploy to production until explicitly approved.

Use preview/staging first.

Document:

docs/DEPLOYMENT.md
docs/VPS-OPERATIONS.md
docs/BACKUP-RESTORE.md
docs/ROLLBACK.md
docs/OWNER-HANDBOOK.md

Owner handbook must explain in plain language:

- edit art;
- mark art available/sold;
- review inquiries;
- review blog drafts;
- publish;
- restore content;
- revoke agent;
- rotate keys;
- export content;
- backup/restore;
- disable automation.

======================================================================
30. ONLY AFTER FREDO IS VERIFIED — EXTRACT ARTIST WORLD ENGINE
======================================================================

Second repo:

https://github.com/executiveusa/artist-scroll-template.git

Do NOT copy Fredo-specific data into the template.

The template must support:

GRILL
→ ASSET INGEST
→ DEEP ARTIST RESEARCH
→ VERIFIED CLAIMS
→ PRD
→ HUMAN APPROVAL
→ CINEMATIC STORY
→ GALLERY
→ ORIGINALS/MERCH/OFFERS
→ OPTIONAL COMMISSIONS/MURALS/LICENSING/BOOK
→ BLOG
→ CONTENT STUDIO
→ DEPLOY.

Configuration:

artist.config.*
brand.config.*
offers.config.*
integrations.config.*
navigation.config.*

Normal onboarding must not require rewriting core components.

Use the grill-me skill one question at a time.

Create a completely different sample artist fixture and prove:

- no Fredo name;
- no Fredo phone;
- no Fredo biography;
- no Fredo images;
- no Chile assumption;
- optional features disappear cleanly;
- different palette/voice;
- different offers;
- template builds.

Do not call it reusable until this test passes.

======================================================================
31. FINAL REPORT FORMAT AT EVERY GATE
======================================================================

DECISION

CHANGES

PROOF

STATUS

COMMERCIAL IMPACT

RISKS

ROLLBACK

NEXT

HUMAN APPROVAL REQUIRED

Never say "done" because code exists.

======================================================================
32. YOUR FIRST RESPONSE / FIRST EXECUTION
======================================================================

Do not start production coding immediately.

1. Execute the bootstrap block in Section 0.
2. Verify repo/tool status.
3. Inventory all supplied Fredo images/media.
4. Inspect existing harness/governance.
5. Report missing evidence and assumptions.
6. Begin the grill-me process with EXACTLY ONE question and your recommended answer.

Then wait for the human response.

Do not ask multiple grill questions at once.
