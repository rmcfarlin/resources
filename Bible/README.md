# Bible study worksheets

Printable, standalone **chapter study handouts** (KJV), produced with the
`bible-study-worksheet` skill.

## One chapter → one complete file

Each study file holds the **entire chapter**: full KJV text **and** all
commentary (context, verse-by-verse notes, meaning, application, questions).
Never split one chapter across multiple study files.

### Sheet order (all in the same file)

1. The Word (full chapter, KJV — every verse)
2. Context
3. Verse-by-verse commentary (covers the whole chapter)
4. Meaning & application
5. Reflect & respond (questions + writing lines)

## Required outputs

Every chapter write produces **both formats** of that same complete study:

```
Bible/Output/<Book>/md/<Book>-NN-Study.md
Bible/Output/<Book>/pdf/<Book>-NN-Study.pdf
```

Example (Psalm 1):

```
Bible/Output/Psalms/md/Psalms-01-Study.md
Bible/Output/Psalms/pdf/Psalms-01-Study.pdf
```

## Generate a worksheet

```bash
cd Bible
npm install   # once — installs pdfkit (and optional docx)
node scripts/generate-worksheet.mjs chapter-data/Psalms/Psalms-01.json
```

## Add a new chapter

1. Create `chapter-data/<Book>/<Book>-NN.json` (see Psalms-01 as a template)
2. Fill KJV verses accurately; write original context/meaning/application
3. Run the generator
4. Hand out the PDF (or share the Markdown)

## Folders

| Path | Purpose |
|------|---------|
| `.grok/skills/bible-study-worksheet/` | Skill instructions for Grok |
| `scripts/generate-worksheet.mjs` | MD + PDF generator |
| `chapter-data/` | Source JSON per chapter |
| `Output/<Book>/md/` | Markdown handouts |
| `Output/<Book>/pdf/` | PDF handouts |
| `references/sources.md` | Commentary / citation policy |

## Notes

- Scripture: King James Version (public domain)
- Study content: original summaries in the tradition of Matthew Henry and
  MacArthur-style / study-Bible exposition—not verbatim proprietary notes
