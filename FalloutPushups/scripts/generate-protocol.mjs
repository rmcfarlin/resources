#!/usr/bin/env node
/**
 * Vault-Tec Strength Clearance — 8-week push-up protocol PDF
 * Light print theme: field ops clipboard + Brotherhood ops manual polish.
 *
 * Usage: node scripts/generate-protocol.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "Output", "Vault-Tec-Strength-Clearance-100.pdf");

const C = {
  paper: "#F2F3F0",
  ink: "#1A1C1A",
  olive: "#4A5640",
  rust: "#8C4A2F",
  steel: "#5A616B",
  gold: "#A68B3C",
  rule: "#2A2C2A",
  grid: "#D8DAD4",
  wash: "#E8EAE3",
};

const WEEKS = [
  { week: 1, a: { planned: 40, scheme: "5×8" }, b: { planned: 45, scheme: "5×9" }, c: { planned: 25, scheme: "max attempt" } },
  { week: 2, a: { planned: 50, scheme: "5×10" }, b: { planned: 55, scheme: "5×11" }, c: { planned: 30, scheme: "max attempt" } },
  { week: 3, a: { planned: 60, scheme: "6×10" }, b: { planned: 66, scheme: "6×11" }, c: { planned: 40, scheme: "max attempt" } },
  { week: 4, a: { planned: 72, scheme: "6×12" }, b: { planned: 78, scheme: "6×13" }, c: { planned: 50, scheme: "max attempt" } },
  { week: 5, a: { planned: 80, scheme: "5×16" }, b: { planned: 90, scheme: "5×18" }, c: { planned: 60, scheme: "max attempt" } },
  { week: 6, a: { planned: 96, scheme: "6×16" }, b: { planned: 102, scheme: "6×17" }, c: { planned: 75, scheme: "max attempt" } },
  { week: 7, a: { planned: 105, scheme: "7×15" }, b: { planned: 112, scheme: "7×16" }, c: { planned: 85, scheme: "max attempt" } },
  { week: 8, a: { planned: 120, scheme: "6×20" }, b: { planned: 120, scheme: "6×20" }, c: { planned: 100, scheme: "CLEARANCE" } },
];

const MOTTOS = [
  "COMMIT · ADAPT · OVERCOME",
  "THE WASTELAND BUILDS STRENGTH",
  "PREPARE · PERFORM · PERSIST",
  "DISCIPLINE KEEPS IT",
  "AD VICTORIAM",
];

function at(doc, font, size, color, text, x, y, opts = {}) {
  doc.font(font).fontSize(size).fillColor(color);
  doc.text(String(text), x, y, { lineBreak: false, ...opts });
}

function wrap(doc, font, size, color, text, x, y, width, height) {
  doc.font(font).fontSize(size).fillColor(color);
  doc.text(String(text), x, y, { width, height, lineGap: 2, ellipsis: true });
}

function registerFonts(doc) {
  const fonts = path.join(ROOT, "fonts");
  doc.registerFont("Bebas", path.join(fonts, "BebasNeue-Regular.ttf"));
  doc.registerFont("Elite", path.join(fonts, "SpecialElite-Regular.ttf"));
}

function hairline(doc, x1, y1, x2, y2, color = C.rule, w = 0.75) {
  doc.strokeColor(color).lineWidth(w).moveTo(x1, y1).lineTo(x2, y2).stroke();
}

/** Faint blueprint grid — print-safe, low ink */
function drawGrid(doc) {
  const step = 18;
  doc.save();
  doc.strokeColor(C.grid).lineWidth(0.35).opacity(0.55);
  for (let x = 24; x < doc.page.width - 12; x += step) {
    doc.moveTo(x, 24).lineTo(x, doc.page.height - 24).stroke();
  }
  for (let y = 24; y < doc.page.height - 12; y += step) {
    doc.moveTo(24, y).lineTo(doc.page.width - 24, y).stroke();
  }
  doc.restore();
}

function pageSetup(doc) {
  doc.fillColor(C.paper);
  doc.rect(0, 0, doc.page.width, doc.page.height).fill();
  drawGrid(doc);
  // Corner registration ticks
  const t = 18;
  const o = 20;
  doc.strokeColor(C.steel).lineWidth(0.8);
  // TL
  doc.moveTo(o, o + t).lineTo(o, o).lineTo(o + t, o).stroke();
  // TR
  doc.moveTo(doc.page.width - o - t, o).lineTo(doc.page.width - o, o).lineTo(doc.page.width - o, o + t).stroke();
  // BL
  doc.moveTo(o, doc.page.height - o - t).lineTo(o, doc.page.height - o).lineTo(o + t, doc.page.height - o).stroke();
  // BR
  doc
    .moveTo(doc.page.width - o - t, doc.page.height - o)
    .lineTo(doc.page.width - o, doc.page.height - o)
    .lineTo(doc.page.width - o, doc.page.height - o - t)
    .stroke();
}

function doubleFrame(doc, x, y, w, h) {
  doc.strokeColor(C.rule).lineWidth(1.6).rect(x, y, w, h).stroke();
  doc.strokeColor(C.steel).lineWidth(0.5).rect(x + 4, y + 4, w - 8, h - 8).stroke();
}

function stamp(doc, text, x, y, opts = {}) {
  const size = opts.size || 10;
  const color = opts.color || C.olive;
  doc.save();
  doc.translate(x, y);
  if (opts.rotate) doc.rotate(opts.rotate);
  doc.strokeColor(color).fillColor(color).lineWidth(opts.filled ? 0 : 1.15);
  doc.font("Bebas").fontSize(size);
  const tw = doc.widthOfString(text);
  const th = size + 7;
  if (opts.filled) {
    doc.rect(-7, -th + 3, tw + 14, th).fillOpacity(0.12).fill();
    doc.fillOpacity(1).strokeColor(color).rect(-7, -th + 3, tw + 14, th).stroke();
  } else {
    doc.rect(-7, -th + 3, tw + 14, th).stroke();
  }
  doc.fillColor(color).text(text, 0, -th + 8, { lineBreak: false });
  doc.restore();
}

/** Circular rubber-stamp motif */
function roundStamp(doc, lines, cx, cy, r, color = C.rust) {
  doc.save();
  doc.translate(cx, cy);
  doc.strokeColor(color).lineWidth(1.4).circle(0, 0, r).stroke();
  doc.lineWidth(0.7).circle(0, 0, r - 5).stroke();
  // star / gear hint
  doc.lineWidth(0.9);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    doc.moveTo(Math.cos(a) * 4, Math.sin(a) * 4).lineTo(Math.cos(a) * 9, Math.sin(a) * 9).stroke();
  }
  doc.font("Bebas").fontSize(7).fillColor(color);
  const label = Array.isArray(lines) ? lines.join("  ·  ") : String(lines);
  // arc approximation: stacked centered lines
  const parts = Array.isArray(lines) ? lines : [String(lines)];
  parts.forEach((p, i) => {
    const tw = doc.widthOfString(p);
    doc.text(p, -tw / 2, -r + 14 + i * 9, { lineBreak: false });
  });
  if (!Array.isArray(lines)) {
    // single motto around — draw as bottom chord
    doc.fontSize(6);
    const tw = doc.widthOfString(label);
    doc.text(label, -Math.min(tw, r * 1.4) / 2, r - 16, {
      width: r * 1.4,
      align: "center",
      lineBreak: false,
    });
  }
  doc.restore();
}

/** Simplified Brotherhood-style mark: sword + wings + gear ring */
function drawInsignia(doc, cx, cy, scale = 1, color = C.gold) {
  doc.save();
  doc.translate(cx, cy).scale(scale);
  doc.strokeColor(color).lineWidth(1.4);
  // gear ring
  doc.circle(0, 4, 16).stroke();
  doc.circle(0, 4, 10).stroke();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    doc
      .moveTo(Math.cos(a) * 16, 4 + Math.sin(a) * 16)
      .lineTo(Math.cos(a) * 20, 4 + Math.sin(a) * 20)
      .stroke();
  }
  // sword
  doc.moveTo(0, -28).lineTo(0, 22).stroke();
  doc.moveTo(-6, -18).lineTo(6, -18).stroke();
  doc.moveTo(-4, 22).lineTo(4, 22).lineTo(0, 28).closePath().stroke();
  // wings
  doc.moveTo(-6, -2).lineTo(-34, -10).lineTo(-28, 2).lineTo(-6, 6).stroke();
  doc.moveTo(6, -2).lineTo(34, -10).lineTo(28, 2).lineTo(6, 6).stroke();
  doc.restore();
}

/** Faint power-armor silhouette watermark (line art) */
function armorWatermark(doc, x, y, scale = 1) {
  doc.save();
  doc.translate(x, y).scale(scale);
  doc.strokeColor(C.steel).lineWidth(0.9).opacity(0.22);
  // helmet
  doc.roundedRect(-22, -50, 44, 36, 8).stroke();
  doc.circle(-10, -34, 5).stroke();
  doc.circle(10, -34, 5).stroke();
  doc.moveTo(-6, -22).lineTo(6, -22).stroke();
  // torso
  doc.roundedRect(-30, -12, 60, 48, 4).stroke();
  doc.circle(0, 8, 10).stroke();
  // pauldrons
  doc.ellipse(-38, -4, 14, 18).stroke();
  doc.ellipse(38, -4, 14, 18).stroke();
  // legs hint
  doc.rect(-22, 36, 16, 40).stroke();
  doc.rect(6, 36, 16, 40).stroke();
  doc.restore();
}

function hazardBanner(doc, x, y, w, h, label) {
  doc.save();
  doc.rect(x, y, w, h).fill(C.ink);
  // diagonal hazard stripes on right third
  const stripeX = x + w * 0.62;
  doc.save();
  doc.rect(stripeX, y, w * 0.38, h).clip();
  doc.strokeColor(C.gold).lineWidth(3);
  for (let i = -h; i < w; i += 10) {
    doc.moveTo(stripeX + i, y + h).lineTo(stripeX + i + h, y).stroke();
  }
  doc.restore();
  at(doc, "Bebas", 14, C.paper, label, x + 12, y + (h - 14) / 2);
  doc.restore();
}

function footer(doc, label, formId = "FORM OPS-EC-8WPP") {
  const m = 40;
  const y = doc.page.height - 28;
  hairline(doc, m, y - 10, doc.page.width - m, y - 10, C.steel, 0.5);
  at(doc, "Elite", 6.5, C.steel, `${formId}  //  VAULT-TEC STRENGTH CLEARANCE  //  FIELD COPY`, m, y);
  at(doc, "Elite", 6.5, C.steel, `REV 1.1  ·  ${label}`, doc.page.width - m - 90, y, {
    width: 90,
    align: "right",
  });
}

function newPage(doc) {
  doc.addPage();
  pageSetup(doc);
}

function coverPage(doc) {
  pageSetup(doc);
  const m = 40;
  const w = doc.page.width;
  const pw = w - 2 * m;

  doubleFrame(doc, m - 6, m - 6, pw + 12, doc.page.height - 2 * m + 12);

  drawInsignia(doc, w / 2, m + 52, 1.05, C.gold);

  at(doc, "Bebas", 10, C.olive, "—  AD VICTORIAM  —", m, m + 95, { width: pw, align: "center" });
  at(doc, "Bebas", 11, C.steel, "OPS  ·  ENDURANCE CLEARANCE  ·  PRINT EDITION", m, m + 112, {
    width: pw,
    align: "center",
  });

  at(doc, "Bebas", 38, C.ink, "STRENGTH CLEARANCE", m, m + 132, { width: pw, align: "center" });
  at(doc, "Bebas", 32, C.ink, "PROTOCOL", m, m + 170, { width: pw, align: "center" });
  at(doc, "Bebas", 16, C.rust, "S.P.E.C.I.A.L. STRENGTH DRILL  ·  100 IN A ROW  ·  8 WEEKS", m, m + 210, {
    width: pw,
    align: "center",
  });

  hairline(doc, m + 50, m + 235, w - m - 50, m + 235, C.gold, 1.4);
  at(doc, "Elite", 9, C.olive, "MAXIMIZE ENDURANCE. BUILD RESOLVE. SERVE THE WASTELAND.", m, m + 244, {
    width: pw,
    align: "center",
  });

  // Operator block
  const obY = m + 270;
  doc.fillColor(C.wash).rect(m + 12, obY, pw - 24, 58).fill();
  doc.strokeColor(C.steel).lineWidth(0.7).rect(m + 12, obY, pw - 24, 58).stroke();
  at(doc, "Bebas", 9, C.steel, "OPERATOR", m + 24, obY + 10);
  hairline(doc, m + 24, obY + 28, m + 220, obY + 28, C.rule, 0.7);
  at(doc, "Bebas", 9, C.steel, "CLEARANCE LEVEL", m + 240, obY + 10);
  hairline(doc, m + 240, obY + 28, w - m - 24, obY + 28, C.rule, 0.7);
  at(doc, "Bebas", 9, C.steel, "MISSION START DATE", m + 24, obY + 36);
  hairline(doc, m + 140, obY + 50, m + 280, obY + 50, C.rule, 0.7);

  wrap(
    doc,
    "Elite",
    9,
    C.ink,
    "Trainee: solo, home station. Three days/week — A/B volume (leave 1–2 reps in reserve), Day C max consecutive clearance check. Log only DATE · PLANNED · ACTUAL. Ink over glow.",
    m + 16,
    obY + 68,
    pw - 32,
    40
  );

  // Disclaimer
  const dY = obY + 118;
  doc.strokeColor(C.rust).lineWidth(1.2).rect(m + 12, dY, pw - 24, 68).stroke();
  doc.fillColor(C.rust).fillOpacity(0.06).rect(m + 12, dY, pw - 24, 68).fill();
  doc.fillOpacity(1);
  at(doc, "Bebas", 10, C.rust, "⚠  MEDICAL CLEARANCE REQUIRED", m + 24, dY + 8);
  wrap(
    doc,
    "Elite",
    7.5,
    C.ink,
    "Always consult a physician or qualified health professional before starting this or any exercise program. This protocol is general fitness material, not medical advice. Stop if you feel pain, dizziness, or unusual discomfort, and seek care as needed.",
    m + 24,
    dY + 26,
    pw - 48,
    36
  );

  roundStamp(doc, ["COMMIT", "ADAPT", "OVERCOME"], w - m - 55, doc.page.height - m - 95, 42, C.rust);
  stamp(doc, "FIELD COPY", m + 18, doc.page.height - m - 70, { size: 12, rotate: -7, filled: true });
  stamp(doc, "FOR INITIATE USE", m + 130, doc.page.height - m - 55, { size: 10, rotate: 3, color: C.olive });

  at(doc, "Elite", 7, C.steel, "DOC ID: VT-SC-100-8W  ·  ISSUED FOR PERSONAL TRAINING  ·  KITCHEN-TABLE FIELD COPY", m, doc.page.height - m - 18, {
    width: pw,
    align: "center",
  });
}

function baselinePage(doc) {
  const m = 40;
  const w = doc.page.width;
  const pw = w - 2 * m;

  hazardBanner(doc, m, m, pw, 26, "WEEK 00  //  BASELINE ASSESSMENT");
  stamp(doc, "DAY 0", w - m - 58, m + 48, { size: 11, color: C.rust });

  wrap(
    doc,
    "Elite",
    10,
    C.ink,
    "Warm up, then perform as many strict consecutive push-ups as you can with clean form. Record below. Baseline is a grid reference — not a verdict.",
    m,
    m + 44,
    pw - 70,
    40
  );

  const boxY = m + 100;
  doubleFrame(doc, m, boxY, pw, 88);
  at(doc, "Bebas", 11, C.steel, "DATE", m + 16, boxY + 16);
  at(doc, "Bebas", 11, C.steel, "BASELINE MAX (CONSECUTIVE)", m + 170, boxY + 16);
  hairline(doc, m + 8, boxY + 40, w - m - 8, boxY + 40, C.steel, 0.5);
  hairline(doc, m + 16, boxY + 72, m + 150, boxY + 72, C.rule, 0.8);
  hairline(doc, m + 170, boxY + 72, w - m - 16, boxY + 72, C.rule, 0.8);

  at(doc, "Bebas", 13, C.ink, "RECRUIT NOTE", m, boxY + 108);
  wrap(
    doc,
    "Elite",
    9,
    C.ink,
    "If baseline is under 15: use knee or hands-elevated push-ups for Weeks 1–2. Keep planned numbers. Switch to full push-ups when Day C hits the printed target. Form beats ego — Vault-Tec does not cover shoulder reconstruction.",
    m,
    boxY + 126,
    pw,
    48
  );

  at(doc, "Bebas", 13, C.olive, "STANDING ORDERS", m, boxY + 185);
  doc.strokeColor(C.olive).lineWidth(0.8).rect(m, boxY + 205, pw, 118).stroke();
  wrap(
    doc,
    "Elite",
    9,
    C.ink,
    "1. Train 3 days/week; leave ≥1 rest day between sessions when you can.\n2. Days A & B: set scheme — stop 1–2 reps before failure.\n3. Day C: one max consecutive attempt (Planned = weekly clearance target).\n4. Write Actual honestly. A miss is data. A blank is fog.\n5. Warm up shoulders. Full range: chest near floor, lockout at top.\n6. Clear any new program with a doctor first — see cover disclaimer.",
    m + 12,
    boxY + 214,
    pw - 24,
    105
  );

  stamp(doc, MOTTOS[1], m + 8, doc.page.height - m - 48, { size: 9, rotate: -4, color: C.rust });
  footer(doc, "02 / 11");
}

function logTable(doc, m, y, rows) {
  const w = doc.page.width;
  const tableW = w - 2 * m;
  const colW = [tableW * 0.26, tableW * 0.37, tableW * 0.37];
  const headerH = 22;
  const rowH = 50;

  doc.strokeColor(C.rule).lineWidth(1.2).rect(m, y, tableW, headerH + rowH * rows.length).stroke();
  // header wash
  doc.fillColor(C.wash).rect(m + 0.5, y + 0.5, tableW - 1, headerH - 1).fill();

  let x = m;
  ["DATE", "PLANNED", "ACTUAL"].forEach((label, i) => {
    at(doc, "Bebas", 11, C.ink, label, x + 10, y + 6);
    if (i < 2) hairline(doc, x + colW[i], y, x + colW[i], y + headerH + rowH * rows.length, C.steel, 0.65);
    x += colW[i];
  });
  hairline(doc, m, y + headerH, w - m, y + headerH, C.rule, 0.9);

  rows.forEach((row, i) => {
    const ry = y + headerH + i * rowH;
    if (i > 0) hairline(doc, m, ry, w - m, ry, C.steel, 0.5);
    if (row.emphasis) {
      doc.fillColor(C.rust).fillOpacity(0.05).rect(m + 1, ry + 1, tableW - 2, rowH - 2).fill();
      doc.fillOpacity(1);
    }

    at(doc, "Bebas", 12, C.olive, row.day, m + 10, ry + 8);
    at(doc, "Elite", 8, C.steel, row.role, m + 10, ry + 26);

    at(doc, "Bebas", 20, row.emphasis ? C.rust : C.ink, String(row.planned), m + colW[0] + 10, ry + 6);
    at(doc, "Elite", 8, C.steel, row.scheme, m + colW[0] + 10, ry + 30);

    const ax = m + colW[0] + colW[1] + 12;
    // checkbox for day complete
    doc.strokeColor(C.olive).lineWidth(1).rect(w - m - 22, ry + 14, 12, 12).stroke();
    hairline(doc, ax, ry + 36, w - m - 36, ry + 36, C.steel, 0.7);
  });

  return y + headerH + rowH * rows.length;
}

function weekPage(doc, weekData, pageLabel) {
  const m = 40;
  const w = doc.page.width;
  const pw = w - 2 * m;
  const ww = String(weekData.week).padStart(2, "0");
  const motto = MOTTOS[weekData.week % MOTTOS.length];

  hazardBanner(doc, m, m, pw, 26, `WEEK ${ww}  //  VOLUME + CLEARANCE CHECK`);
  stamp(doc, `W${ww}`, w - m - 48, m + 44, { size: 12, color: C.olive, filled: true });

  at(doc, "Elite", 8, C.steel, "A/B = volume (submaximal).  C = max consecutive.  Rest ≥1 day between sessions when possible.", m, m + 42);

  const rows = [
    { day: "DAY A", role: "Volume sets", planned: weekData.a.planned, scheme: weekData.a.scheme, emphasis: false },
    { day: "DAY B", role: "Volume sets", planned: weekData.b.planned, scheme: weekData.b.scheme, emphasis: false },
    { day: "DAY C", role: "Clearance check", planned: weekData.c.planned, scheme: weekData.c.scheme, emphasis: true },
  ];
  const tableBottom = logTable(doc, m, m + 60, rows);

  at(doc, "Bebas", 11, C.ink, "NOTES / OBSERVATIONS", m, tableBottom + 18);
  armorWatermark(doc, w - m - 70, tableBottom + 110, 1.15);

  doc.strokeColor(C.steel).lineWidth(0.6).rect(m, tableBottom + 34, pw, 108).stroke();
  for (let i = 0; i < 4; i++) {
    hairline(doc, m + 10, tableBottom + 56 + i * 20, w - m - 10, tableBottom + 56 + i * 20, C.steel, 0.5);
  }

  // Approval strip
  const aY = tableBottom + 156;
  at(doc, "Bebas", 9, C.steel, "SELF-CHECK (OPTIONAL)", m, aY);
  hairline(doc, m + 120, aY + 10, m + 280, aY + 10, C.rule, 0.7);
  at(doc, "Elite", 7, C.steel, "form / effort / recovery", m + 120, aY + 14);

  if (weekData.week === 8) {
    stamp(doc, "TARGET: 100", w - m - 120, aY + 8, { size: 13, rotate: -6, color: C.rust, filled: true });
  } else {
    stamp(doc, motto, w - m - 160, aY + 20, { size: 8, rotate: -5, color: C.rust });
  }

  footer(doc, pageLabel);
}

function graduationPage(doc) {
  const m = 40;
  const w = doc.page.width;
  const pw = w - 2 * m;

  drawInsignia(doc, w / 2, m + 48, 1.2, C.gold);
  at(doc, "Bebas", 11, C.olive, "—  AD VICTORIAM  —", m, m + 95, { width: pw, align: "center" });
  at(doc, "Bebas", 28, C.ink, "CLEARANCE GRANTED?", m, m + 118, { width: pw, align: "center" });

  wrap(
    doc,
    "Elite",
    10,
    C.olive,
    "If Week 8 Day C Actual ≥ 100 consecutive with honest form, you are cleared.\nIf not: repeat Week 7–8 volume, then re-attempt. Persistence is a vault virtue.",
    m + 28,
    m + 155,
    pw - 56,
    45
  );

  const boxY = m + 215;
  doubleFrame(doc, m + 24, boxY, pw - 48, 140);
  at(doc, "Bebas", 12, C.ink, "FINAL MAX", m + 48, boxY + 28);
  at(doc, "Bebas", 12, C.ink, "DATE CLEARED", m + 48, boxY + 72);
  hairline(doc, m + 48, boxY + 52, w - m - 48, boxY + 52, C.steel, 0.7);
  hairline(doc, m + 48, boxY + 96, w - m - 48, boxY + 96, C.steel, 0.7);

  roundStamp(doc, ["CLEARANCE", "GRANTED"], w / 2, boxY + 175, 48, C.olive);
  stamp(doc, "THE WASTELAND BUILDS STRENGTH", m + 20, doc.page.height - m - 70, {
    size: 9,
    rotate: -3,
    color: C.rust,
    filled: true,
  });

  at(doc, "Elite", 8, C.steel, "Dark Pip-Boy companion app: deferred. This document remains the field source of truth.", m, doc.page.height - m - 42, {
    width: pw,
    align: "center",
  });

  footer(doc, "11 / 11");
}

function main() {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const doc = new PDFDocument({
    size: "LETTER",
    autoFirstPage: true,
    bufferPages: true,
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    info: {
      Title: "Vault-Tec Strength Clearance Protocol — 100 Push-Ups / 8 Weeks",
      Author: "resources / Vault-Tec Strength Clearance",
      Subject: "Printable Fallout-themed push-up training log",
    },
  });
  const stream = fs.createWriteStream(OUT);
  doc.pipe(stream);
  registerFonts(doc);

  coverPage(doc);
  newPage(doc);
  baselinePage(doc);

  WEEKS.forEach((week, i) => {
    newPage(doc);
    weekPage(doc, week, `${String(i + 3).padStart(2, "0")} / 11`);
  });

  newPage(doc);
  graduationPage(doc);

  const range = doc.bufferedPageRange();
  if (range.count !== 11) {
    console.warn(`Expected 11 pages, got ${range.count}`);
  }

  doc.flushPages();
  doc.end();
  stream.on("finish", () => {
    console.log(`Wrote ${OUT}`);
    console.log(`Pages: ${range.count}`);
  });
}

main();
