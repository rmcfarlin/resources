---
name: bible-study-worksheet
description: >
  Create one complete Bible study handout per chapter: full KJV text plus all
  chapter commentary in a single file. Always writes Markdown and PDF under
  Bible/Output/<Book>/{md,pdf}/. Use for Bible study sheets, chapter handouts,
  or /bible-study-worksheet. Follow Bible/.grok/skills/bible-study-worksheet/SKILL.md.
metadata:
  short-description: "One complete chapter study (KJV + commentary → MD + PDF)"
---

# Bible Study Worksheet

**One chapter = one complete study file** (full KJV + all commentary in that file).

Always write both formats of the same whole-chapter content:

- `Bible/Output/<Book>/md/<Book>-NN-Study.md`
- `Bible/Output/<Book>/pdf/<Book>-NN-Study.pdf`

Full workflow: `Bible/.grok/skills/bible-study-worksheet/SKILL.md`

```bash
cd Bible
node scripts/generate-worksheet.mjs chapter-data/Psalms/Psalms-01.json
```
