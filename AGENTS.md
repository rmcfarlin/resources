# Project rules — resources workspace

## Bible study worksheets

Chapter study handouts live under `Bible/`. Skill: `bible-study-worksheet`
(`/bible-study-worksheet`). **One chapter = one complete study file** (full KJV
+ all commentary in that file). Always emit both Markdown and PDF of the same
content:

```bash
cd Bible && node scripts/generate-worksheet.mjs chapter-data/Psalms/Psalms-01.json
# → Output/<Book>/md/<Book>-NN-Study.md
# → Output/<Book>/pdf/<Book>-NN-Study.pdf
```

Sheet order: full KJV → context → verse-by-verse commentary → meaning & application → questions.

## SkillOpt skill improvement

This workspace integrates [Microsoft SkillOpt](https://github.com/microsoft/SkillOpt):
agent skills are treated as trainable text, improved via rollouts, reflection,
bounded edits, and a held-out validation gate.

### Day-to-day (SkillOpt-Sleep)

Use the `skillopt-sleep` skill (or run the scripts directly):

```bash
bash scripts/run-sleep.sh status
bash scripts/run-sleep.sh dry-run --backend mock
bash scripts/run-sleep.sh run --backend handoff   # real improvement on Grok budget
bash scripts/run-sleep.sh adopt                   # after reviewing staging/
```

| Artifact | Location |
|----------|----------|
| Engine | `vendor/SkillOpt` |
| Venv | `.venv` (Python ≥ 3.10) |
| Grok skill shell | `.grok/skills/skillopt-sleep/` |
| Learned skill | `.grok/skills/skillopt-sleep-learned/SKILL.md` |
| Staging | `.skillopt-sleep/staging/` |
| Session harvest | `~/.grok/sessions/` (`--source grok`) |

**Safety:** harvest is read-only; proposals are staged; adopt writes backups.
Do not auto-adopt unless the user explicitly asks.

### Full paper training loop (optional)

For benchmark-style skill training (epochs, batch size, LR scheduler):

```bash
source .venv/bin/activate
# example: see vendor/SkillOpt/docs and configs/
python vendor/SkillOpt/scripts/train.py --config vendor/SkillOpt/configs/searchqa/default.yaml ...
```

Requires API credentials (see `vendor/SkillOpt/.env.example`). Prefer Sleep for
local agent skill evolution; use the full trainer for offline benchmark runs.

### Preferences for the optimizer

When running sleep with real backends, pass house rules:

```bash
bash scripts/run-sleep.sh run --backend handoff \
  --preferences "Use relative paths. Confirm destructive git/shared actions."
```

<!-- SKILLOPT-SLEEP:LEARNED START -->
## Learned preferences & procedures

_This block is managed by SkillOpt-Sleep. Edits here are proposed offline,
validated against your past tasks, and adopted only after you approve them.
Hand-edits outside this block are never touched._

<!-- SKILLOPT-SLEEP:LEARNED END -->
