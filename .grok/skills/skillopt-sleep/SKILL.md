---
name: skillopt-sleep
description: >
  Drive SkillOpt-Sleep offline self-evolution for this Grok workspace. Use when
  the user wants to improve agent skills from past sessions, run a sleep/dream
  cycle, harvest Grok transcripts, dry-run/run/adopt/status, schedule nightly
  skill optimization, or mentions SkillOpt / skill improvement / validation-gated
  skill edits. Use with /skillopt-sleep.
metadata:
  short-description: "SkillOpt sleep cycle for Grok skills"
---

# SkillOpt-Sleep (Grok workspace)

SkillOpt treats skill markdown as trainable parameters. This skill runs the
**SkillOpt-Sleep** deployment loop against *this* project:

```
harvest Grok sessions → mine recurring tasks → replay offline
  → reflect → bounded edits → held-out GATE → stage proposal → (you) adopt
```

Nothing live changes until `adopt`. Every adopt backs up prior files first.

## Workspace wiring

| Piece | Path |
|-------|------|
| Runner | `scripts/run-sleep.sh` |
| Engine | `vendor/SkillOpt` (editable install in `.venv`) |
| Sessions | `~/.grok/sessions/` (source=`grok`) |
| Evolved skill | `.grok/skills/skillopt-sleep-learned/SKILL.md` |
| Evolved memory | `AGENTS.md` (protected learned block) |
| Staging | `.skillopt-sleep/staging/<timestamp>/` |

## How to drive it

Always prefer the workspace runner (sets Grok defaults):

```bash
bash scripts/run-sleep.sh status
bash scripts/run-sleep.sh harvest
bash scripts/run-sleep.sh dry-run --backend mock
bash scripts/run-sleep.sh run --backend handoff
bash scripts/run-sleep.sh run --backend mock   # free smoke / heuristic cycle
bash scripts/run-sleep.sh adopt
bash scripts/run-sleep.sh schedule --hour 3 --minute 17
bash scripts/run-sleep.sh unschedule
```

Actions: `status` | `harvest` | `dry-run` | `run` | `adopt` | `schedule` | `unschedule`.

### Backend choices

| Backend | When to use |
|---------|-------------|
| `mock` (default) | Free, deterministic; harvest + heuristic mine + mock replay. First smoke check. |
| `handoff` | **Recommended for real Grok improvement** without a separate API key. Engine stages prompt files; this Grok session answers them between re-runs. |
| `claude` / `codex` / `copilot` | Only if those CLIs are installed and the user wants their budget. |

### Useful flags

```bash
bash scripts/run-sleep.sh run --backend handoff \
  --preferences "Prefer relative paths. Confirm before destructive git ops." \
  --edit-budget 4 \
  --lookback-hours 168 \
  --max-tasks 20
```

| Flag | Meaning |
|------|---------|
| `--preferences "..."` | House rules prior for the optimizer |
| `--gate on\|off` | Strict held-out gate (default on) |
| `--edit-budget N` | Max edits per night (textual LR) |
| `--lookback-hours N` | Harvest window (default 72) |
| `--auto-adopt` | Apply without review (power users only) |
| `--json` | Machine-readable output |

## Handoff loop (recommended on Grok)

1. `bash scripts/run-sleep.sh run --backend handoff`
2. Exit code `3` means prompts are waiting under `.skillopt-sleep-handoff/`.
3. Read `PROMPTS.md` / `pending.json`. Answer **each prompt in a fresh context**
   (subagent or new session) into `answers/<id>.md`.
4. Re-run the same command until exit `0` (cycle complete / staged).
5. Read staged `report.md`, then `adopt` only after user approval.

Integrity: never answer handoff prompts from a context that already saw the
mined tasks and references — that contaminates the held-out gate.

## Steps for the agent

1. Parse the user request into an action (`status`, `dry-run`, `run`, `adopt`, …).
2. Run `bash scripts/run-sleep.sh <action> …` from the workspace root.
3. For `dry-run` / `run`, report: sessions, tasks, baseline → candidate score,
   gate action, proposed edits.
4. If a staging dir is printed, read `report.md` before summarizing.
5. Offer `adopt` only after the user reviews the proposal.
6. Never hand-edit `AGENTS.md` or managed skills as a substitute for `adopt`.

## Hard rules

- Harvest is **read-only**. Do not edit raw session transcripts.
- Redact secrets from any summary of transcript content.
- Show validation evidence before recommending adoption.
- Treat staged edits as proposals, not source of truth.

## Validate install

```bash
.venv/bin/python -c "import skillopt_sleep; print('ok')"
bash scripts/run-sleep.sh dry-run --backend mock --json
.venv/bin/python -m skillopt_sleep.experiments.run_experiment --persona researcher --assert-improves
```
