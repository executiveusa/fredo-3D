# FREDO 3D — Premium Build Harness

## Prime directive

Build an art experience, not a generic portfolio. The artwork is the protagonist.

## Required execution order

1. Inspect.
2. Grill one unresolved decision at a time.
3. Research and verify.
4. Create PRD + story map + design constitution.
5. Human approval.
6. Create standalone HTML prototypes.
7. Human visual approval.
8. Build one vertical slice at a time.
9. Independent review.
10. Fix verified defects only.
11. Zero-secret verification.
12. Human production approval.
13. Deploy.

No production code before approved PRD.

## Token law

When jCodeMunch is available:
- use outline/tree first;
- search symbols before files;
- retrieve exact relevant symbols;
- inspect callers/importers/blast radius before edits;
- avoid whole-file reads unless file-level context is genuinely required;
- reindex after structural changes.

When RTK is available:
- prefer it for noisy shell/git/test/build/search output;
- preserve raw failure logs;
- use raw output when compression hides required evidence.

## Design law

Every visual choice must answer at least one:
- Does it clarify where I am?
- Does it make the next action obvious?
- Does it reveal Fredo's artwork?
- Does it strengthen Fredo's story?
- Does it help a collector/client act?
- Does it improve accessibility?
- Does it improve performance?

If none apply, remove it.

## Premium floor

Overall review target: >= 8.5/10.
No axis below 7.0.
Any P0 blocker fails the gate.
Builder cannot approve itself.

## Default commercial priority

1. Original artworks.
2. Merchandise/prints.
3. Make-an-offer.
4. Commissions/murals/travel.
5. Licensing/collaboration/book.

## Default technical mode

The default public build must require zero application secrets.
Future integrations must be adapter-driven and fail honestly when disabled.
