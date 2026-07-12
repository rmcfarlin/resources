---
name: bible-study-worksheet
description: >
  Create one complete Bible study handout per chapter: full KJV text plus all
  chapter commentary (context, verse notes, meaning, application, questions)
  in a single file. Always writes Markdown and PDF under
  Bible/Output/<Book>/{md,pdf}/. Use for Bible study sheets, chapter handouts,
  Sunday school, or /bible-study-worksheet.
metadata:
  short-description: "One complete chapter study (KJV + commentary → MD + PDF)"
---

# Bible Study Worksheet — one chapter, one complete file

**Core rule:** Each Bible chapter produces **one self-contained study** that
includes the **entire KJV chapter** and **all commentary for that chapter** in
the same document. Never split a chapter across multiple study files. Never
emit Scripture-only or commentary-only deliverables.

Everything lives under `Bible/`.

## What “one file” means

For a given chapter (e.g. Psalms 1):

| Format | Single complete file |
|--------|----------------------|
| Markdown | `Bible/Output/Psalms/md/Psalms-01-Study.md` |
| PDF | `Bible/Output/Psalms/pdf/Psalms-01-Study.pdf` |

Each of those files is a **full** study of that chapter:

1. Header (book, chapter, title)
2. **Full KJV text** — every verse of the chapter, numbered
3. **Context** — whole-chapter setting
4. **Verse-by-verse commentary** — notes covering the whole chapter (not a subset)
5. **Chapter meaning & application** — synthesis for life today
6. **Reflect & respond** — questions + answer space
7. Sources footer

The MD and PDF are twins of the **same whole-chapter content** (two formats,
one study). Do not create separate files for “text,” “notes,” or “questions.”

## Fixed structure (in this order, all in the same file)

1. **Header** — Book, chapter, “Bible Study Worksheet”, KJV, optional subtitle  
2. **The Word (KJV)** — complete chapter, all verses  
3. **Context** — genre, placement, setting for the chapter as a whole  
4. **Verse-by-verse commentary** — sequential notes for the full chapter  
5. **Meaning & application** — chapter synthesis + life today  
6. **Reflect & respond** — 2–3 questions with answer lines  
7. **Footer** — sources (Henry, MacArthur-style themes paraphrased; KJV public domain)

## Where files go

| Kind | Path |
|------|------|
| Skill | `Bible/.grok/skills/bible-study-worksheet/` |
| Generator | `Bible/scripts/generate-worksheet.mjs` |
| Chapter source JSON | `Bible/chapter-data/<Book>/<Book>-NN.json` |
| Markdown (complete) | `Bible/Output/<Book>/md/<Book>-NN-Study.md` |
| PDF (complete) | `Bible/Output/<Book>/pdf/<Book>-NN-Study.pdf` |
| Sources policy | `Bible/references/sources.md` |

Book folders: `Psalms`, `Genesis`, `John`, … (correct spelling; not `Pslams`).  
Zero-pad chapters: `Psalms-01`, `John-03`.

## Workflow

### 1. Resolve book + chapter

Parse “Psalm 1” / “Psalms 1” / “John 3”. One chapter per generation run unless
the user asks for a series (then one complete file **per** chapter).

### 2. Gather content for the whole chapter

**KJV (required):** every verse, accurate, public-domain KJV. No omissions.

**Context:** whole-chapter orientation.

**Verse-by-verse commentary:** cover the full chapter in order. Synthesize in
your own words from Matthew Henry, MacArthur-style / study-Bible tradition,
Spurgeon on Psalms when helpful. Do not paste proprietary study notes.

**Meaning & application:** chapter-level synthesis + concrete life today.

**Questions (2–3):** open-ended; answer lines under each.

### 3. Write one JSON for the whole chapter

`Bible/chapter-data/<Book>/<Book>-NN.json`

```json
{
  "book": "Psalms",
  "chapter": 1,
  "title": "The Two Ways",
  "subtitle": "…",
  "translation": "KJV",
  "verses": [
    { "n": 1, "text": "…" }
  ],
  "context": "…",
  "verse_commentary": [
    { "n": 1, "note": "…" },
    { "n": "2-3", "note": "…" }
  ],
  "meaning": "…",
  "application": "…",
  "questions": ["…?", "…?"],
  "sources": ["…"]
}
```

Rules:

- `verses` must include **all** verses of the chapter.
- `verse_commentary` must cover the **whole** chapter (every verse appears in
  some note range, e.g. `1`, `2-3`, or `4-6`).
- All commentary fields go into the **same** output file as the Scripture.

### 4. Generate (always both formats of the same complete study)

```bash
cd Bible
node scripts/generate-worksheet.mjs chapter-data/Psalms/Psalms-01.json
# → Output/Psalms/md/Psalms-01-Study.md   (full chapter + all commentary)
# → Output/Psalms/pdf/Psalms-01-Study.pdf (same content, printable)
```

Confirm both exist and each contains full KJV + all commentary sections.

### 5. Deliver

Report both paths. State that each file is a complete whole-chapter study.
Do not claim verbatim MacArthur Study Bible quotations.

## Hard rules

- **One chapter → one complete study file per format** (md + pdf).
- **No partial chapters** (missing verses or commentary only on part of the chapter).
- **No multi-file splits** of a single chapter’s study content.
- Handout must stand alone: open one PDF (or MD) and study the whole chapter.

## Batch / series

For Psalms 1–5, produce five complete pairs (md+pdf), each covering only that
chapter in full—not one combined multi-chapter file unless the user asks.
