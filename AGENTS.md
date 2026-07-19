# FREDO 3D — Agent Entrypoint

Before substantial work, read and obey:

1. `.studio/HARNESS.md`
2. `.studio/AGENT-RULES.md`
3. `.studio/KRUG-GATE.md`
4. `.studio/PREMIUM-SCORECARD.json`

## Token discipline

When jCodeMunch is available:
- call its guide first;
- inspect repo outline/tree before broad reads;
- search symbols before opening entire files;
- retrieve exact relevant symbols;
- check callers/importers/blast radius before edits;
- reindex after structural changes.

When RTK is available:
- prefer it for noisy shell, git, build, test, lint and search output;
- retain raw failure logs as evidence;
- do not let compression hide required verification.

## Build gates

No production implementation before:
- verified research;
- approved PRD;
- approved design constitution;
- approved story map;
- approved standalone HTML prototypes.

One bounded ticket at a time. Builders cannot approve themselves. No production deploy without explicit human approval.
