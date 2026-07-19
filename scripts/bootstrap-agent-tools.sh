#!/usr/bin/env bash
# Bootstrap RTK (rtk-ai/rtk) + jCodeMunch for agent sessions.
# Development tooling only — never a runtime dependency of the website.
set -Eeuo pipefail

export RTK_TELEMETRY_DISABLED=1
export JCODEMUNCH_SUMMARIZER_PROVIDER=none
export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"

# 1) Bootstrap the existing project harness.
bash scripts/fredo-studio.sh bootstrap || true

# 2) Install/verify the CORRECT RTK (rtk-ai/rtk), then initialize it for Claude/Fable.
install_rtk() {
  case "$(uname -s)" in
    MINGW*|MSYS*|CYGWIN*)
      # Windows: official install.sh only supports Linux/macOS — use the MSVC release zip.
      mkdir -p "$HOME/.local/bin"
      tmp="$(mktemp -d)"
      curl -fsSL -o "$tmp/rtk.zip" \
        "https://github.com/rtk-ai/rtk/releases/latest/download/rtk-x86_64-pc-windows-msvc.zip"
      unzip -o "$tmp/rtk.zip" -d "$tmp" >/dev/null
      mv "$tmp/rtk.exe" "$HOME/.local/bin/rtk.exe"
      rm -rf "$tmp"
      ;;
    *)
      curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh
      ;;
  esac
  export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"
}

if ! command -v rtk >/dev/null 2>&1 || ! rtk gain >/dev/null 2>&1; then
  echo "[bootstrap] Installing RTK Token Killer from rtk-ai/rtk..."
  install_rtk
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
