# FREDO 3D — Agent Rules

## Before implementation

Required:
- `docs/PRD.html`
- `docs/PRD.md`
- `docs/DESIGN-CONSTITUTION.html`
- `docs/STORY-MAP.html`
- `docs/COMMERCE-MODEL.md`
- `docs/CINEMATIC-COMPONENT-AUDIT.html`

Then stop for human approval.

## Before production UI implementation

Required standalone review surfaces:
- `design/story-prototype.html`
- `design/gallery-prototype.html`
- `design/intake-prototype.html`
- `design/motion-prototype.html`

Then stop for visual approval.

## During implementation

One bounded ticket at a time.

Each ticket must state:
- objective;
- likely files;
- dependencies;
- acceptance criteria;
- verification;
- evidence;
- prohibited changes;
- rollback path.

Do not:
- AI-redraw Fredo artwork;
- invent artwork metadata, biography, prices, press, buyers, reviews or awards;
- fake payment or integration success;
- require application secrets for the default build;
- let cinematic effects hide navigation, content or CTAs.

## Independent review

Builder cannot approve itself.
Require independent reviews for:
- user value / conversion;
- visual taste / authenticity;
- accessibility / mobile;
- architecture / sovereignty / security.
