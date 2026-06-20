---
name: graphics-design
description: Create polished static graphics — posters, social/OG images, quote cards, banners — by filling a JSON layout template with data and rendering it to PNG/WebP with the takumi engine (no headless browser). Use when the user asks to design or generate a poster, social card, OG image, banner, or other static visual.
---

# Graphics Design

Design static graphics as **JSON templates + data**, rendered to images with
[takumi](https://takumi.kane.tw) — a Rust engine that turns JSON node trees into
PNG/WebP/JPEG without a browser.

- A **template** (`templates/*.json`) is a takumi node tree with `{{slot}}` placeholders.
  It owns the layout, type scale, and spacing.
- A **data file** (`data/*.json`) fills the slots — copy, colors, sizes.
- The **render script** interpolates data into the template and produces an image.

This separation means you can restyle by editing the template, or re-skin/re-copy by
editing only the data — without touching layout.

## Iterate loop

```bash
npm install                                   # once: installs takumi
node scripts/render.mjs templates/og.json     # data/og.json + out/og.png inferred
```

1. Pick or write a template + data file.
2. Render. 3. **Open the PNG and critique it** against the principles below. 4. Edit data
(or template) and re-render. Repeat until it's right.

Explicit paths and format when you need them:
```bash
node scripts/render.mjs templates/og.json data/og.json out/og.webp --format webp
```

## Templates included
- `og.json` (1200×630) — social / link-preview card.
- `poster.json` (1080×1350) — editorial poster, oversized headline.
- `quote.json` (1080×1080) — centered serif quote card.
- `banner.json` (1500×500) — wide banner with an accent block.

Start from the closest one, copy it to a new name, and adjust.

## Template anatomy

```json
{
  "width": 1200,
  "height": 630,
  "fonts": [{ "family": "Inter", "weight": [400, 600, 800] }],
  "root": { /* a takumi node tree, with {{slots}} in strings */ }
}
```

A node is one of:
- `{ "type": "container", "style": {…}, "children": [ … ] }` — a flexbox box.
- `{ "type": "text", "text": "…", "style": {…} }` — a text run.
- `{ "type": "image", "src": "https://… or data URI", "style": {…} }`.

### Slot rules (how data fills the template)
- `"{{title}}"` as a whole string → replaced by the raw data value (so numbers/colors/arrays keep their type — e.g. `"fontSize": "{{size}}"` with `"size": 88`).
- `"{{accent}} text"` inside a longer string → string substitution.
- `{{slot}}` with no matching data key is left as-is (partial fills are fine).
- Keys support dots: `{{theme.ink}}`.

## takumi rules (verified — ignore at your peril)

- **Fonts must be TTF.** The render script loads Google Fonts as ttf via an old-UA
  trick. takumi **silently drops woff2** and falls back to a default sans — so a
  "wrong" font usually means a woff2 leak, not a typo. Just list a Google family
  name in `fonts`; the script handles the rest.
- **Colors are CSS strings** (`"#0b1020"`, `"rgba(0,0,0,.5)"`), **never** packed integers.
- **Flexbox only.** Every visible box should set `"display": "flex"`. Default
  `flexDirection` is `row` — set it explicitly.
- **Line breaks:** `"\n"` inside one text node does NOT break. Use separate `text`
  nodes in a column, or `"whiteSpace": "pre"` on the style.
- `width`/`height` accept `"100%"`, numbers (px), `"50vw"`, etc.
- `fontFamily` in a style must match a `family` listed in `fonts`.
- Output formats: `png`, `webp`, `jpeg`.

## Design principles (apply every render)

- **One focal point.** The largest type is the single most important message; everything else steps down from it.
- **Type scale, not type soup.** 2 sizes + 1 weight ramp. Big, deliberate jumps (e.g. 76/30, weights 800/400).
- **Generous margins.** Pad the canvas ≥ 6–8% per side. Crowded edges read as amateur.
- **Limited palette.** 1 background, 1 ink, 1 accent. Tints of those before any new hue.
- **Align to a grid.** Left-align a column or center a stack — don't mix without reason.
- **Contrast for legibility.** Check the *rendered* image, not the hex values.
- **Let it breathe.** `gap` and `padding` create rhythm; don't cram.

After each render ask: *what's the focal point? is anything cramped or touching an edge?
is the palette disciplined? does the type scale look intentional?* Then edit and re-render.

## Reference
- `reference/design-principles.md` — longer notes + composition recipes.
