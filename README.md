# resources — SkillOpt skill improvement

This workspace wires [Microsoft SkillOpt](https://github.com/microsoft/SkillOpt)
into a **Grok Build** project so agent skills improve from real usage.

## What you get

1. **SkillOpt-Sleep** — nightly / on-demand loop:
   harvest Grok sessions → mine tasks → replay → reflect → bounded edits →
   **validation gate** → stage → you adopt.
2. **Grok skill** — `/skillopt-sleep` (`.grok/skills/skillopt-sleep/`).
3. **Managed learned skill** — `.grok/skills/skillopt-sleep-learned/SKILL.md`.
4. **Project memory** — protected learned block in `AGENTS.md`.

## Setup (already done if you pulled this tree)

```bash
# if needed:
python3.11 -m venv .venv
.venv/bin/pip install -e vendor/SkillOpt
chmod +x scripts/run-sleep.sh
```

Python **≥ 3.10** required (this tree uses 3.11 in `.venv`).

## Quick start

```bash
# free smoke check (no API spend)
bash scripts/run-sleep.sh dry-run --backend mock

# status / harvest debug
bash scripts/run-sleep.sh status
bash scripts/run-sleep.sh harvest

# real cycle on Grok (handoff uses this session as the model)
bash scripts/run-sleep.sh run --backend handoff

# after reviewing .skillopt-sleep/staging/<ts>/report.md
bash scripts/run-sleep.sh adopt
```

Or ask Grok: *“run skillopt-sleep dry-run”* / *“/skillopt-sleep status”*.

## Layout

```
.
├── AGENTS.md                          # project rules + learned memory block
├── scripts/run-sleep.sh               # Grok-defaulted CLI wrapper
├── .grok/skills/
│   ├── skillopt-sleep/SKILL.md        # driver skill
│   └── skillopt-sleep-learned/        # evolved skill artifact
├── .venv/                             # Python env with skillopt
├── vendor/SkillOpt/                   # upstream (+ local Grok harvest patches)
└── .skillopt-sleep/                   # staging + state (created on first run)
```

## Upstream vs local patches

`vendor/SkillOpt` is a shallow clone of microsoft/SkillOpt with small local
extensions for Grok:

- `skillopt_sleep/harvest_grok.py` — read `~/.grok/sessions`
- `transcript_source=grok` + `memory_path` / `AGENTS.md` defaults
- CLI: `--source grok`, `--memory-path`, `--grok-home`

Re-cloning upstream will drop these; re-apply from git history or this README.

## Full SkillOpt trainer

Benchmark training (SearchQA, etc.) lives under `vendor/SkillOpt/scripts/train.py`.
See [upstream docs](https://microsoft.github.io/SkillOpt/docs/guideline.html).
Data is not bundled; configure credentials via `.env` (see `vendor/SkillOpt/.env.example`).

## License

SkillOpt is MIT (Microsoft). Workspace glue is for local use.
