#!/usr/bin/env bash
set -Eeuo pipefail
IFS=$'\n\t'

VERSION="1.0.0"
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

STUDIO="$ROOT/.studio"
REPORTS="$STUDIO/reports"
LOGS="$STUDIO/logs"
ROLLBACK="$STUDIO/rollback"
EVIDENCE="$ROOT/artifacts/design-audit"
SCREENSHOTS="$EVIDENCE/screenshots"
DESIGN="$ROOT/design"
DOCS="$ROOT/docs"
REVIEWS="$DOCS/reviews"

export RTK_TELEMETRY_DISABLED="${RTK_TELEMETRY_DISABLED:-1}"
export JCODEMUNCH_SUMMARIZER_PROVIDER="${JCODEMUNCH_SUMMARIZER_PROVIDER:-none}"

say(){ printf '▶ %s\n' "$*"; }
ok(){ printf '✓ %s\n' "$*"; }
warn(){ printf '! %s\n' "$*" >&2; }
die(){ printf '✗ %s\n' "$*" >&2; exit 1; }
has(){ command -v "$1" >/dev/null 2>&1; }

ensure_dirs(){ mkdir -p "$REPORTS" "$LOGS" "$ROLLBACK" "$SCREENSHOTS" "$DESIGN" "$DOCS" "$REVIEWS"; }

write_if_missing(){
  local path="$1"
  if [[ -e "$path" ]]; then warn "Preserving existing ${path#$ROOT/}"; cat >/dev/null; return 0; fi
  mkdir -p "$(dirname "$path")"
  cat > "$path"
  ok "Created ${path#$ROOT/}"
}

detect_pm(){
  if [[ -f pnpm-lock.yaml ]]; then echo pnpm
  elif [[ -f yarn.lock ]]; then echo yarn
  elif [[ -f bun.lockb || -f bun.lock ]]; then echo bun
  elif [[ -f package-lock.json || -f package.json ]]; then echo npm
  else echo ""
  fi
}

has_npm_script(){
  local n="$1"; [[ -f package.json ]] || return 1; has node || return 1
  node -e 'const p=require("./package.json");process.exit(p.scripts&&p.scripts[process.argv[1]]?0:1)' "$n"
}

pm_run(){ local pm="$1" s="$2"; case "$pm" in npm) npm run "$s";; pnpm) pnpm run "$s";; yarn) yarn "$s";; bun) bun run "$s";; *) die "No package manager";; esac; }

run_logged(){
  local label="$1"; shift; ensure_dirs
  local slug log
  slug="$(printf '%s' "$label" | tr '[:upper:] /:' '[:lower:]---' | tr -cd 'a-z0-9._-')"
  log="$LOGS/$(date -u +%Y%m%dT%H%M%SZ)-$slug.log"
  say "$label"
  if "$@" >"$log" 2>&1; then ok "$label"; tail -n 8 "$log" || true
  else warn "$label failed; full log: ${log#$ROOT/}"; tail -n 80 "$log" || true; return 1; fi
}

bootstrap(){
  ensure_dirs
  write_if_missing "$STUDIO/HARNESS.md" <<'EOF'
# FREDO 3D Premium Build Harness

## Prime directive
Build an art experience, not a generic portfolio. The artwork is the protagonist.

## Required order
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

## Token law
When jCodeMunch is available: outline first, search symbols, retrieve exact symbols, check importers/blast radius, avoid broad whole-file reading.
When RTK is available: use it for noisy shell/git/test/build output; preserve raw failure logs.

## Design law
Every visual choice must clarify navigation, reveal the art, strengthen the story, improve conversion, accessibility, or performance. Otherwise remove it.

## Premium floor
Overall >= 8.5/10, no axis < 7.0, no P0 blockers. Builder cannot approve itself.
EOF

  write_if_missing "$STUDIO/KRUG-GATE.md" <<'EOF'
# Krug-Informed UX Gate

- [ ] First-time visitor understands what this site is within seconds.
- [ ] Pages are self-evident.
- [ ] Visual hierarchy is obvious.
- [ ] Clickable things look clickable.
- [ ] Navigation uses familiar conventions where helpful.
- [ ] Pages are scannable.
- [ ] Primary next action is obvious.
- [ ] Forms ask only what is needed.
- [ ] Page/section names match what users clicked.
- [ ] Logo/home behavior is predictable.
- [ ] Current location/context is clear.
- [ ] Users always have an escape route.
- [ ] Homepage explains the site's purpose and choices.
- [ ] Cinematic effects never bury the primary task.
- [ ] Trunk test passes: identity, location, sections, navigation, next action.

## Fredo-specific
- [ ] Art appears before sales pressure.
- [ ] Available/sold/private/licensing states are unmistakable.
- [ ] Make-an-offer does not imply automatic acceptance.
- [ ] Commissions/murals are custom quote only.
- [ ] Licensing requires human negotiation.
- [ ] Chilean Spanish is natural; English preserves meaning.
- [ ] Motion helps meaning and reduced-motion preserves the experience.
- [ ] Gallery works without animation.
- [ ] No fake metrics, press, scarcity, buyers or reviews.
- [ ] No generic AI/SaaS visual language.
EOF

  write_if_missing "$STUDIO/AGENT-RULES.md" <<'EOF'
# Agent Rules

Before implementation require:
- docs/PRD.html
- docs/PRD.md
- docs/DESIGN-CONSTITUTION.html
- docs/STORY-MAP.html
- docs/COMMERCE-MODEL.md
- docs/CINEMATIC-COMPONENT-AUDIT.html
Then stop for human approval.

Before production UI require:
- design/story-prototype.html
- design/gallery-prototype.html
- design/intake-prototype.html
- design/motion-prototype.html
Then stop for visual approval.

One bounded ticket at a time. Every ticket states objective, files, dependencies, acceptance, verification, evidence, prohibited changes, rollback.

Never AI-redraw Fredo's art, invent metadata/biography/prices/press, fake payment success, or require application secrets for the default build.
EOF

  write_if_missing "$STUDIO/PREMIUM-SCORECARD.json" <<'EOF'
{
  "threshold": 8.5,
  "minimum_axis_score": 7.0,
  "p0_blockers": [],
  "scores": {
    "krug_clarity": null,
    "art_first_storytelling": null,
    "visual_hierarchy": null,
    "typography_and_spacing": null,
    "cinematic_restraint": null,
    "gallery_commerce_clarity": null,
    "mobile_quality": null,
    "accessibility": null,
    "performance": null,
    "spanish_language_quality": null,
    "trust_and_factual_integrity": null,
    "anti_slop_originality": null
  },
  "reviewer": null,
  "reviewed_at": null,
  "notes": ""
}
EOF

  write_if_missing "$SCREENSHOTS/README.md" <<'EOF'
# Required visual evidence

desktop-1440-home.png
desktop-1440-gallery.png
desktop-1440-artwork.png
desktop-1440-intake.png
mobile-390-home.png
mobile-390-gallery.png
mobile-390-artwork.png
mobile-390-intake.png
reduced-motion-home.png
keyboard-focus.png
EOF

  ok "Harness bootstrap complete"
}

doctor(){
  ensure_dirs; say "Repository: $ROOT"
  for c in git bash node npm pnpm yarn bun python3 ffmpeg rtk jcodemunch-mcp; do
    if has "$c"; then printf '%-16s %s\n' "$c" "$($c --version 2>/dev/null | head -1 || true)"; else printf '%-16s not installed\n' "$c"; fi
  done
  if has rtk; then rtk gain 2>/dev/null | head -30 || true; else warn "RTK not detected"; fi
  if has jcodemunch-mcp; then jcodemunch-mcp config --check 2>/dev/null || true; else warn "jCodeMunch not detected"; fi
}

inspect(){
  ensure_dirs; local r="$REPORTS/inspect-$(date -u +%Y%m%dT%H%M%SZ).txt"
  {
    echo '# branch'; git branch --show-current 2>/dev/null || true
    echo '# commit'; git rev-parse HEAD 2>/dev/null || true
    echo '# status'; git status --short 2>/dev/null || true
    echo '# files'; find . -maxdepth 3 -type f -not -path './.git/*' -not -path './node_modules/*' -not -path './.next/*' -not -path './dist/*' | sort | head -250
  } > "$r"
  ok "Wrote ${r#$ROOT/}"; sed -n '1,220p' "$r"
}

index_repo(){ has jcodemunch-mcp || die "Install jcodemunch-mcp first"; jcodemunch-mcp config --check || true; jcodemunch-mcp init --yes --index --audit; }

snapshot(){
  ensure_dirs; local n="${1:-manual}" d="$ROLLBACK/$(date -u +%Y%m%dT%H%M%SZ)-$n"; mkdir -p "$d"
  git status --short > "$d/status.txt" 2>/dev/null || true
  git diff > "$d/working.patch" 2>/dev/null || true
  git diff --cached > "$d/staged.patch" 2>/dev/null || true
  git rev-parse HEAD > "$d/head.txt" 2>/dev/null || true
  git branch --show-current > "$d/branch.txt" 2>/dev/null || true
  git bundle create "$d/repository.bundle" --all >/dev/null 2>&1 || true
  ok "Rollback snapshot ${d#$ROOT/}"
}

build_project(){ local pm="$(detect_pm)"; [[ -n "$pm" ]] || die "No package manager"; has_npm_script build || die "No build script"; run_logged "production build" pm_run "$pm" build; }

test_project(){ local pm="$(detect_pm)" ran=0; [[ -n "$pm" ]] || die "No package manager"; for s in lint typecheck test; do if has_npm_script "$s"; then ran=1; run_logged "$s" pm_run "$pm" "$s"; fi; done; [[ "$ran" -eq 1 ]] || warn "No lint/typecheck/test scripts yet"; }

secret_scan(){
  ensure_dirs; local r="$REPORTS/secret-scan-$(date -u +%Y%m%dT%H%M%SZ).txt"
  grep -RInE --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist --exclude-dir=build --exclude='*.lock' '(sk-[A-Za-z0-9_-]{20,}|pat[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|PAYPAL_CLIENT_SECRET\s*=|STRIPE_SECRET_KEY\s*=)' . > "$r" 2>/dev/null || true
  if [[ -s "$r" ]]; then warn "Potential secret patterns found: ${r#$ROOT/}"; sed -n '1,80p' "$r"; return 1; fi
  rm -f "$r"; ok "Heuristic secret scan passed"
}

zero_secret(){
  local pm="$(detect_pm)"; [[ -n "$pm" ]] || die "No package manager"; has_npm_script build || die "No build script"
  ensure_dirs; local log="$LOGS/$(date -u +%Y%m%dT%H%M%SZ)-zero-secret.log"
  env -i HOME="$HOME" PATH="$PATH" USER="${USER:-}" SHELL="${SHELL:-/bin/bash}" TERM="${TERM:-dumb}" LANG="${LANG:-C.UTF-8}" CI=1 NODE_ENV=production bash -lc "cd $(printf '%q' "$ROOT") && $(printf '%q' "$pm") run build" > "$log" 2>&1 || { tail -n 100 "$log"; return 1; }
  ok "Zero-secret build passed"
}

qa(){ secret_scan; test_project; build_project; zero_secret; ok "Technical QA complete"; }

tokens(){
  has rtk && rtk gain 2>/dev/null || warn "RTK unavailable"
  [[ -f .jcodemunch.jsonc ]] && cat .jcodemunch.jsonc || true
  cat <<'EOF'
Token rules:
1. Outline first.
2. Search symbol before opening whole files.
3. Retrieve exact symbol + callers/importers.
4. Use RTK for verbose shell/git/test/build output.
5. Preserve raw failure logs.
6. Keep stage context scoped.
EOF
}

usage(){ cat <<EOF
FREDO 3D Studio Harness v$VERSION

Commands:
  bootstrap
  doctor
  inspect
  index
  snapshot [name]
  build
  test
  secrets
  zero-secret
  qa
  tokens

This script never deploys production and never runs destructive rollback commands.
EOF
}

cmd="${1:-help}"; shift || true
case "$cmd" in
  bootstrap) bootstrap;;
  doctor) doctor;;
  inspect) inspect;;
  index) index_repo;;
  snapshot) snapshot "${1:-manual}";;
  build) build_project;;
  test) test_project;;
  secrets) secret_scan;;
  zero-secret) zero_secret;;
  qa) qa;;
  tokens) tokens;;
  help|-h|--help) usage;;
  *) usage; die "Unknown command: $cmd";;
esac
