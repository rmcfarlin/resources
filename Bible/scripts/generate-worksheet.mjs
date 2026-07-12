#!/usr/bin/env node
/**
 * Generate Bible study worksheet outputs from chapter JSON.
 *
 * Always writes BOTH:
 *   Bible/Output/<Book>/md/<Book>-NN-Study.md
 *   Bible/Output/<Book>/pdf/<Book>-NN-Study.pdf
 *
 * Usage:
 *   node scripts/generate-worksheet.mjs chapter-data/Psalms/Psalms-01.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BIBLE_ROOT = path.resolve(__dirname, "..");

const COLORS = {
  ink: "#1A1A1A",
  muted: "#4A4A4A",
  accent: "#2C4A6E",
  rule: "#8B7355",
  lightRule: "#C4B5A0",
};

function die(msg) {
  console.error(msg);
  process.exit(1);
}

function loadJson(filePath) {
  const abs = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(abs)) die(`File not found: ${abs}`);
  return JSON.parse(fs.readFileSync(abs, "utf8"));
}

function padChapter(n) {
  return String(n).padStart(2, "0");
}

function baseName(data) {
  return `${data.book}-${padChapter(data.chapter)}-Study`;
}

function outputPaths(data) {
  const book = data.book;
  const name = baseName(data);
  return {
    md: path.join(BIBLE_ROOT, "Output", book, "md", `${name}.md`),
    pdf: path.join(BIBLE_ROOT, "Output", book, "pdf", `${name}.pdf`),
  };
}

function sourceLine(data) {
  const sources =
    data.sources && data.sources.length
      ? data.sources.slice(0, 3).join("; ")
      : "KJV (public domain); classic evangelical commentary tradition (Henry; MacArthur-style themes, paraphrased)";
  return `Sources: ${sources}. Scripture: King James Version (public domain).`;
}

function answerLineMarkdown(count = 3) {
  return Array(count).fill("").join("\n\n_______________________________________________");
}

/** Build standalone Markdown handout */
function buildMarkdown(data) {
  const book = data.book;
  const chapter = data.chapter;
  const title = data.title || `Chapter ${chapter}`;
  const subtitle = data.subtitle || "";
  const translation = data.translation || "KJV";
  const verses = data.verses || [];
  const questions = data.questions || [];

  const lines = [];
  lines.push(`# Bible Study Worksheet`);
  lines.push("");
  lines.push(`## ${book} ${chapter}`);
  lines.push("");
  lines.push(`*${title}*`);
  if (subtitle) {
    lines.push("");
    lines.push(`> ${subtitle}`);
  }
  lines.push("");
  lines.push(`**${translation}** · Standalone study handout`);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(`## 1 · The Word (${translation})`);
  lines.push("");
  for (const v of verses) {
    lines.push(`**${v.n}** *${v.text}*`);
    lines.push("");
  }
  lines.push("---");
  lines.push("");
  lines.push(`## 2 · Context`);
  lines.push("");
  lines.push((data.context || "").trim());
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(`## 3 · Verse-by-Verse Commentary`);
  lines.push("");
  lines.push(
    `*The notes below cover the whole chapter in one place—read with the KJV text above.*`
  );
  lines.push("");
  const vnotes = data.verse_commentary || [];
  if (vnotes.length) {
    for (const vc of vnotes) {
      lines.push(`### Verse ${vc.n}`);
      lines.push("");
      lines.push(String(vc.note || "").trim());
      lines.push("");
    }
  } else {
    lines.push(`*(Verse notes are included in the chapter meaning below.)*`);
    lines.push("");
  }
  lines.push("---");
  lines.push("");
  lines.push(`## 4 · Meaning & Application`);
  lines.push("");
  if (data.meaning) {
    lines.push(`### Meaning`);
    lines.push("");
    lines.push(String(data.meaning).trim());
    lines.push("");
  }
  if (data.application) {
    lines.push(`### Application for life today`);
    lines.push("");
    lines.push(String(data.application).trim());
    lines.push("");
  }
  lines.push("---");
  lines.push("");
  lines.push(`## 5 · Reflect & Respond`);
  lines.push("");
  lines.push(
    `*Write your answers in the space below. There are no “right length” answers—honesty before God is the aim.*`
  );
  lines.push("");
  questions.forEach((q, i) => {
    lines.push(`### ${i + 1}. ${q}`);
    lines.push("");
    lines.push(answerLineMarkdown(3));
    lines.push("");
  });
  lines.push("---");
  lines.push("");
  lines.push(
    `**Name:** ____________________________  **Date:** ______________  **Group / Church:** ________________________`
  );
  lines.push("");
  lines.push(`*${sourceLine(data)}*`);
  lines.push("");
  return lines.join("\n");
}

/** PDF helpers */
function drawSectionRule(doc, y, color = COLORS.rule) {
  doc
    .moveTo(doc.page.margins.left, y)
    .lineTo(doc.page.width - doc.page.margins.right, y)
    .strokeColor(color)
    .lineWidth(1)
    .stroke();
}

function ensureSpace(doc, needed = 72) {
  const bottom = doc.page.height - doc.page.margins.bottom;
  if (doc.y + needed > bottom) {
    doc.addPage();
  }
}

function sectionHeading(doc, text) {
  ensureSpace(doc, 36);
  doc.moveDown(0.35);
  doc
    .font("Helvetica-Bold")
    .fontSize(9.5)
    .fillColor(COLORS.accent)
    .text(text.toUpperCase(), { characterSpacing: 1.2 });
  const y = doc.y + 1;
  drawSectionRule(doc, y, COLORS.rule);
  doc.y = y + 7;
}

function bodyText(doc, text, opts = {}) {
  const font = opts.bold
    ? "Times-Bold"
    : opts.italics
      ? "Times-Italic"
      : "Times-Roman";
  const left = doc.page.margins.left;
  const width =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;
  doc.x = left;
  doc
    .font(font)
    .fontSize(opts.size || 10)
    .fillColor(opts.color || COLORS.ink)
    .text(text, left, doc.y, {
      width,
      align: opts.align || "left",
      lineGap: 1.5,
    });
}

function writeParagraphs(doc, text) {
  String(text || "")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .forEach((block) => {
      ensureSpace(doc, 28);
      bodyText(doc, block);
      doc.moveDown(0.15);
    });
}

function answerLinesPdf(doc, count = 3) {
  for (let i = 0; i < count; i++) {
    ensureSpace(doc, 18);
    const y = doc.y + 14;
    doc
      .moveTo(doc.page.margins.left, y)
      .lineTo(doc.page.width - doc.page.margins.right, y)
      .strokeColor(COLORS.lightRule)
      .lineWidth(0.7)
      .stroke();
    doc.y = y + 2;
  }
}

function buildPdf(data, outPath) {
  return new Promise((resolve, reject) => {
    const margin = 42;
    const doc = new PDFDocument({
      size: "LETTER",
      margins: { top: margin, bottom: margin, left: margin, right: margin },
      info: {
        Title: `${data.book} ${data.chapter} Bible Study Worksheet`,
        Author: "Bible Study Worksheet",
        Subject: data.title || "",
      },
    });

    const stream = fs.createWriteStream(outPath);
    doc.pipe(stream);

    const book = data.book;
    const chapter = data.chapter;
    const title = data.title || `Chapter ${chapter}`;
    const subtitle = data.subtitle || "";
    const translation = data.translation || "KJV";
    const verses = data.verses || [];
    const questions = data.questions || [];
    const left = doc.page.margins.left;
    const contentWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;

    const resetX = () => {
      doc.x = left;
    };

    // Header
    resetX();
    doc
      .font("Helvetica-Bold")
      .fontSize(8.5)
      .fillColor(COLORS.accent)
      .text("BIBLE STUDY WORKSHEET", left, doc.y, {
        width: contentWidth,
        align: "center",
        characterSpacing: 1.2,
      });
    doc
      .font("Times-Bold")
      .fontSize(20)
      .fillColor(COLORS.ink)
      .text(`${book} ${chapter}`, left, doc.y + 2, {
        width: contentWidth,
        align: "center",
      });
    doc
      .font("Times-Italic")
      .fontSize(12)
      .fillColor(COLORS.muted)
      .text(title, left, doc.y + 1, { width: contentWidth, align: "center" });
    if (subtitle) {
      doc
        .font("Times-Roman")
        .fontSize(9)
        .fillColor(COLORS.muted)
        .text(subtitle, left, doc.y + 1, {
          width: contentWidth,
          align: "center",
        });
    }
    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(COLORS.muted)
      .text(`${translation}  ·  Standalone study handout`, left, doc.y + 2, {
        width: contentWidth,
        align: "center",
      });
    doc.y += 6;
    drawSectionRule(doc, doc.y, COLORS.rule);
    doc.y += 10;
    resetX();

    // Scripture
    sectionHeading(doc, `1 · The Word (${translation})`);
    resetX();
    for (const v of verses) {
      ensureSpace(doc, 28);
      resetX();
      const label = `${v.n}  `;
      doc.font("Helvetica-Bold").fontSize(9).fillColor(COLORS.accent);
      const labelW = doc.widthOfString(label);
      doc.text(label, left, doc.y, { continued: false, lineBreak: false });
      doc
        .font("Times-Italic")
        .fontSize(10)
        .fillColor(COLORS.ink)
        .text(v.text, left + labelW, doc.y, {
          width: contentWidth - labelW,
          lineGap: 1.2,
        });
      doc.moveDown(0.15);
      resetX();
    }

    // Context
    sectionHeading(doc, "2 · Context");
    resetX();
    writeParagraphs(doc, data.context);

    // Verse-by-verse commentary (whole chapter in this file)
    sectionHeading(doc, "3 · Verse-by-Verse Commentary");
    resetX();
    bodyText(
      doc,
      "The notes below cover the whole chapter in one place—read with the KJV text above.",
      { italics: true, size: 9, color: COLORS.muted }
    );
    doc.moveDown(0.2);
    const vnotes = data.verse_commentary || [];
    if (vnotes.length) {
      for (const vc of vnotes) {
        ensureSpace(doc, 36);
        resetX();
        doc
          .font("Helvetica-Bold")
          .fontSize(10)
          .fillColor(COLORS.accent)
          .text(`Verse ${vc.n}`, left, doc.y, { width: contentWidth });
        doc.moveDown(0.1);
        resetX();
        writeParagraphs(doc, vc.note || "");
      }
    } else {
      resetX();
      bodyText(doc, "(Verse notes are included in the chapter meaning below.)", {
        italics: true,
        size: 9,
        color: COLORS.muted,
      });
      doc.moveDown(0.2);
    }

    // Meaning & application
    sectionHeading(doc, "4 · Meaning & Application");
    resetX();
    if (data.meaning) {
      ensureSpace(doc, 24);
      resetX();
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(COLORS.accent)
        .text("Meaning.", left, doc.y, { width: contentWidth });
      doc.moveDown(0.12);
      resetX();
      writeParagraphs(doc, data.meaning);
    }
    if (data.application) {
      ensureSpace(doc, 24);
      resetX();
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(COLORS.accent)
        .text("Application for life today.", left, doc.y, {
          width: contentWidth,
        });
      doc.moveDown(0.12);
      resetX();
      writeParagraphs(doc, data.application);
    }

    // Questions
    sectionHeading(doc, "5 · Reflect & Respond");
    resetX();
    bodyText(
      doc,
      "Write your answers in the space below. There are no “right length” answers—honesty before God is the aim.",
      { italics: true, size: 9, color: COLORS.muted }
    );
    doc.moveDown(0.2);

    questions.forEach((q, i) => {
      ensureSpace(doc, 72);
      resetX();
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(COLORS.accent)
        .text(`${i + 1}. `, left, doc.y, { continued: true });
      doc
        .font("Times-Roman")
        .fontSize(10)
        .fillColor(COLORS.ink)
        .text(q, { width: contentWidth, lineGap: 1.2 });
      answerLinesPdf(doc, 3);
      doc.moveDown(0.25);
      resetX();
    });

    // Name + sources (end matter — avoids footer page bloat)
    ensureSpace(doc, 48);
    resetX();
    doc.moveDown(0.35);
    drawSectionRule(doc, doc.y, COLORS.lightRule);
    doc.y += 8;
    resetX();
    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(COLORS.muted)
      .text(
        "Name: ____________________________    Date: ______________    Group / Church: ________________________",
        left,
        doc.y,
        { width: contentWidth }
      );
    doc.moveDown(0.4);
    resetX();
    doc
      .font("Helvetica-Oblique")
      .fontSize(7)
      .fillColor(COLORS.muted)
      .text(sourceLine(data), left, doc.y, {
        width: contentWidth,
        lineGap: 1,
      });

    doc.end();
    stream.on("finish", () => resolve(outPath));
    stream.on("error", reject);
  });
}

async function main() {
  const args = process.argv.slice(2);
  if (!args.length || args[0] === "-h" || args[0] === "--help") {
    console.log(
      "Usage: node scripts/generate-worksheet.mjs <chapter.json>\n\n" +
        "Always writes:\n" +
        "  Output/<Book>/md/<Book>-NN-Study.md\n" +
        "  Output/<Book>/pdf/<Book>-NN-Study.pdf"
    );
    process.exit(0);
  }

  const data = loadJson(args[0]);
  if (!data.book || !data.chapter || !Array.isArray(data.verses)) {
    die("JSON must include book, chapter, and verses[]");
  }

  const paths = outputPaths(data);
  fs.mkdirSync(path.dirname(paths.md), { recursive: true });
  fs.mkdirSync(path.dirname(paths.pdf), { recursive: true });

  const md = buildMarkdown(data);
  fs.writeFileSync(paths.md, md, "utf8");
  console.log(`Wrote ${paths.md}`);

  await buildPdf(data, paths.pdf);
  console.log(`Wrote ${paths.pdf}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
