---
version: alpha
name: Vault-Tec Strength Clearance
description: Light-print Fallout field ops / Brotherhood manual for an 8-week push-up protocol
colors:
  paper: "#F2F3F0"
  ink: "#1A1C1A"
  olive: "#4A5640"
  rust: "#8C4A2F"
  steel: "#5A616B"
  gold: "#A68B3C"
  rule: "#2A2C2A"
  stamp: "#4A5640"
typography:
  display:
    fontFamily: "Bebas Neue, Impact, Helvetica Neue, sans-serif"
    fontSize: "42px"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "0.04em"
  headline:
    fontFamily: "Bebas Neue, Impact, Helvetica Neue, sans-serif"
    fontSize: "28px"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0.06em"
  title:
    fontFamily: "Oswald, Arial Narrow, Helvetica, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0.08em"
  body:
    fontFamily: "Special Elite, Courier New, Courier, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0.01em"
  label:
    fontFamily: "Oswald, Arial Narrow, Helvetica, sans-serif"
    fontSize: "9px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.14em"
rounded:
  none: "0px"
  sm: "2px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  margin: "48px"
components:
  log-row:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "10px 12px"
  stamp:
    backgroundColor: "transparent"
    textColor: "{colors.olive}"
    rounded: "{rounded.none}"
    padding: "4px 8px"
  week-header:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.none}"
    padding: "0 0 8px 0"
---

<!-- SEED: written from approved visual probes (field ops clipboard + Brotherhood ops manual) before first PDF build. Re-run /impeccable document after craft if tokens drift. -->

# Design System: Vault-Tec Strength Clearance

## Overview

**Creative North Star: "Wasteland clipboard on a kitchen table"**

A light, print-first system that feels like recovered Brotherhood field paperwork crossed with a Vault-Tec clearance form—readable under home lighting, markable with a ballpoint, never a glowing Pip-Boy. Olive stamps and muted gold insignia do the Fallout work; the page itself stays near-white and high-contrast so planned vs actual reps dominate.

Density is procedural, not decorative: stencil headers, ruled log grids, thin steel rules, occasional rubber-stamp language. Reject dark CRT HUDs (app-only later), neon gamer fitness templates, and Vault Boy sticker bombs that bury the numbers.

**Key Characteristics:**
- Light paper ground, charcoal ink (print-honest)
- Military stencil + typewriter pairing
- Olive / rust / steel / gold accents ≤10% of the page
- Flat tonal hierarchy (rules + stamps, not shadows)
- Mission copy over illustration

## Colors

Restrained field palette: paper and ink carry the page; olive and rust act as stamps; gold is insignia-only; steel is secondary type and rules.

### Primary
- **Olive Drab** (#4A5640): Stamps, week marks, “CLEARANCE” language, secondary rules. The Fallout field accent.

### Secondary
- **Oxidized Rust** (#8C4A2F): Sparse emphasis—warnings, “missed / deferred” hints, underlines on Day C max targets.

### Tertiary
- **Muted Insignia Gold** (#A68B3C): Brotherhood-style marks and cover chevrons only. Never large fills.

### Neutral
- **Field Paper** (#F2F3F0): Page background—cool near-white, not cream/parchment cliché.
- **Charcoal Ink** (#1A1C1A): All primary reading text.
- **Steel Gray** (#5A616B): Captions, set-scheme fine print, column headers.
- **Hairline Rule** (#2A2C2A): Table borders and section dividers.

### Named Rules
**The Stamp Tax Rule.** Accent colors (olive, rust, gold) together occupy ≤10% of any page. If the page starts looking “designed,” remove a stamp.

**The Pip-Boy Ban (print).** No phosphor green fills, no scanline overlays, no black page grounds in the PDF. Dark CRT is reserved for a future app.

## Typography

**Display Font:** Bebas Neue (Impact / Helvetica Neue fallback)  
**Title / Label Font:** Oswald (Arial Narrow / Helvetica fallback)  
**Body Font:** Special Elite (Courier New / Courier fallback)

**Character:** Stencil command headers meet typewriter body—operations manual, not lifestyle magazine. Uppercase tracked labels for columns; sentence case only in instructional paragraphs.

### Hierarchy
- **Display** (Bebas, ~36–42pt on cover): Protocol title.
- **Headline** (Bebas, ~24–28pt): Week headers (`WEEK 03 — VOLUME + CLEARANCE CHECK`).
- **Title** (Oswald SemiBold, ~14–16pt, tracked): Day labels (`DAY A — VOLUME`).
- **Body** (Special Elite, 10–11pt): Instructions, recruit notes, form cues.
- **Label** (Oswald, 8–9pt, uppercase, wide tracking): Column heads (`DATE` / `PLANNED` / `ACTUAL`).

## Elevation

Flat print system. Hierarchy comes from **rule weight, stamp ink, and type size**—not drop shadows, gradients, or cards. A double hairline may frame the log table; never a floating panel.

## Components

### Log row
Three equal columns (Date | Planned | Actual) with handwriting-height blank cells (~28–32pt tall). Planned cell may include small set-scheme caption under the number. Sharp corners; 0.5–1pt steel/ink rules.

### Week header bar
Bebas week title left; olive stamped week index right (`W03`). Thin rust underline only on weeks that include a Day C max attempt (all of them).

### Stamp
Outlined or solid olive text badge (`OPS`, `FIELD COPY`, `CLEARANCE GRANTED`)—rotated 0–8° max, never covering log cells.

### Cover block
Charcoal title, gold chevron or simple sword/gear line mark, short mission brief in Special Elite. No full-bleed illustration; optional faint geometric watermark at ≤8% opacity.

## Do's and Don'ts

- Do keep body copy ≥10pt on paper and contrast ≥4.5:1 (charcoal on field paper).
- Do prefer an extra page over cramping eight weeks onto one sheet.
- Do print planned numbers; leave Actual blank for the trainee.
- Don't use cream/sand parchment fills or warm “AI paper” tints.
- Don't use Pip-Boy green-on-black, scanlines, or neon accents in the PDF.
- Don't put Vault Boy art in the log grid or shrink type to fit more weeks.
- Don't use soft card shadows, pill buttons, or rounded “app” chrome on print pages.
