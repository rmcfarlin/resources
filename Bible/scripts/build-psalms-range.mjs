#!/usr/bin/env node
/**
 * Fetch KJV for a Psalms range (or all missing), merge study modules,
 * write chapter-data JSON, and generate MD + PDF.
 *
 * Usage:
 *   node scripts/build-psalms-range.mjs              # all chapters with study modules, skip existing
 *   node scripts/build-psalms-range.mjs 11 30        # inclusive range
 *   node scripts/build-psalms-range.mjs --force 11 30
 */
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { spawnSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BIBLE_ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(BIBLE_ROOT, "chapter-data", "Psalms");
const STUDIES_DIR = path.join(__dirname, "studies");
const KJV_CACHE_DIR = path.join(BIBLE_ROOT, "chapter-data", "_kjv-cache", "Psalms");

const SOURCES = [
  "King James Version (public domain)",
  "Matthew Henry, Commentary on the Whole Bible (themes summarized)",
  "Expository themes consistent with MacArthur Study Bible tradition (paraphrased, not quoted)",
];

function cleanText(t) {
  return String(t || "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}

function cachePath(n) {
  return path.join(KJV_CACHE_DIR, `Psalms-${String(n).padStart(2, "0")}.json`);
}

async function fetchChapter(n) {
  fs.mkdirSync(KJV_CACHE_DIR, { recursive: true });
  const cached = cachePath(n);
  if (fs.existsSync(cached)) {
    return JSON.parse(fs.readFileSync(cached, "utf8"));
  }

  const urls = [
    `https://bible-api.com/psalms%20${n}?translation=kjv`,
    `https://cdn.jsdelivr.net/gh/scrollmapper/bible_databases@master/json/en_kjv.json`,
  ];

  // Primary: bible-api.com per chapter
  let lastErr;
  for (let attempt = 1; attempt <= 6; attempt++) {
    try {
      const res = await fetch(urls[0]);
      if (res.status === 429) {
        const wait = 2000 * attempt;
        await sleep(wait);
        continue;
      }
      if (!res.ok) throw new Error(`Fetch failed for Psalm ${n}: ${res.status}`);
      const data = await res.json();
      const verses = (data.verses || []).map((v) => ({
        n: v.verse,
        text: cleanText(v.text),
      }));
      if (!verses.length) throw new Error(`No verses for Psalm ${n}`);
      fs.writeFileSync(cached, JSON.stringify(verses, null, 2) + "\n");
      return verses;
    } catch (e) {
      lastErr = e;
      await sleep(1500 * attempt);
    }
  }
  throw lastErr || new Error(`Fetch failed for Psalm ${n}`);
}

async function loadAllStudies() {
  const files = fs
    .readdirSync(STUDIES_DIR)
    .filter((f) => f.startsWith("psalms-") && f.endsWith(".mjs"))
    .sort();
  const studies = {};
  for (const f of files) {
    const mod = await import(pathToFileURL(path.join(STUDIES_DIR, f)).href);
    Object.assign(studies, mod.STUDIES || {});
  }
  return studies;
}

function buildJson(chapter, verses, study) {
  return {
    book: "Psalms",
    chapter,
    title: study.title,
    subtitle: study.subtitle,
    translation: "KJV",
    verses,
    context: study.context,
    verse_commentary: study.verse_groups.map(([n, note]) => ({ n, note })),
    meaning: study.meaning,
    application: study.application,
    questions: study.questions,
    sources: SOURCES,
  };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== "--force");
  const force = process.argv.includes("--force");
  let from = 11;
  let to = 150;
  if (args.length >= 2) {
    from = Number(args[0]);
    to = Number(args[1]);
  } else if (args.length === 1) {
    from = to = Number(args[0]);
  }

  fs.mkdirSync(DATA_DIR, { recursive: true });
  const STUDIES = await loadAllStudies();
  const gen = path.join(BIBLE_ROOT, "scripts", "generate-worksheet.mjs");

  const chapters = [];
  for (let n = from; n <= to; n++) {
    if (!STUDIES[n]) continue;
    const nn = String(n).padStart(2, "0");
    const outJson = path.join(DATA_DIR, `Psalms-${nn}.json`);
    const outMd = path.join(BIBLE_ROOT, "Output", "Psalms", "md", `Psalms-${nn}-Study.md`);
    const outPdf = path.join(BIBLE_ROOT, "Output", "Psalms", "pdf", `Psalms-${nn}-Study.pdf`);
    if (!force && fs.existsSync(outJson) && fs.existsSync(outMd) && fs.existsSync(outPdf)) {
      console.log(`Psalm ${n}: skip (exists)`);
      continue;
    }
    chapters.push(n);
  }

  console.log(`Building ${chapters.length} chapter(s) from ${from}–${to}`);

  for (const n of chapters) {
    process.stdout.write(`Psalm ${n}: fetch… `);
    const verses = await fetchChapter(n);
    if (!verses.length) throw new Error(`No verses for Psalm ${n}`);
    const json = buildJson(n, verses, STUDIES[n]);
    const nn = String(n).padStart(2, "0");
    const outJson = path.join(DATA_DIR, `Psalms-${nn}.json`);
    fs.writeFileSync(outJson, JSON.stringify(json, null, 2) + "\n");
    process.stdout.write(`json(${verses.length}v)… `);
    const r = spawnSync(process.execPath, [gen, outJson], {
      cwd: BIBLE_ROOT,
      encoding: "utf8",
    });
    if (r.status !== 0) {
      console.error(r.stdout || "", r.stderr || "");
      throw new Error(`Generator failed for Psalm ${n}`);
    }
    console.log("md+pdf ok");
    await sleep(1200);
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
