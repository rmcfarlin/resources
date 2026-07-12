#!/usr/bin/env bash
# Workspace wrapper for SkillOpt-Sleep (Grok Build integration).
# Defaults: harvest Grok sessions, evolve AGENTS.md + managed skill, mock backend.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export SKILLOPT_SLEEP_REPO="${SKILLOPT_SLEEP_REPO:-$ROOT/vendor/SkillOpt}"
export SKILLOPT_SLEEP_PYTHON="${SKILLOPT_SLEEP_PYTHON:-$ROOT/.venv/bin/python}"

if [ ! -x "$SKILLOPT_SLEEP_PYTHON" ]; then
  echo "[sleep] ERROR: Python venv missing at $SKILLOPT_SLEEP_PYTHON" >&2
  echo "[sleep] Run: python3.11 -m venv .venv && .venv/bin/pip install -e vendor/SkillOpt" >&2
  exit 1
fi

if [ ! -d "$SKILLOPT_SLEEP_REPO/skillopt_sleep" ]; then
  echo "[sleep] ERROR: SkillOpt not found at $SKILLOPT_SLEEP_REPO" >&2
  exit 1
fi

# Default Grok-oriented knobs; caller flags still override later args.
PROJECT="${SKILLOPT_PROJECT:-$ROOT}"
DEFAULTS=(
  --project "$PROJECT"
  --source grok
  --memory-path AGENTS.md
  --target-skill-path ".grok/skills/skillopt-sleep-learned/SKILL.md"
)

if [ "$#" -eq 0 ]; then
  set -- status
fi

# If the first arg is an action, keep it first; inject defaults after.
ACTION="$1"
shift || true

cd "$SKILLOPT_SLEEP_REPO"
exec "$SKILLOPT_SLEEP_PYTHON" -m skillopt_sleep "$ACTION" "${DEFAULTS[@]}" "$@"
