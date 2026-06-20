---
name: graphics-design
description: Design polished static graphics — posters, social/OG images, quote cards, banners — to professional standards. Two modes: RENDER produces an actual PNG/WebP/JPEG file via the takumi engine (no browser); ADVISE structures a standards-compliant design spec for another renderer (Satori, HTML/CSS, Figma) or an MCP/tool JSON contract without rendering. Use whenever the user wants to design, generate, or spec a poster, social card, OG image, banner, or other static visual.
---

# Graphics Design

This skill has **two modes**. Pick one up front:

- **RENDER mode** — the user wants an actual image file. Fill a JSON template with data and
  render it to PNG/WebP/JPEG with takumi. Jump to [Render mode](#render-mode).
- **ADVISE mode** — the user wants a *spec*, not a pixel: a layout/structure for another
  renderer (Satori, HTML/CSS, Figma) or a JSON contract for a tool/MCP workflow. Jump to
  [Advise mode](#advise-mode).

Both modes enforce the same design canon in `reference/design-principles.md` — one focal
point, a disciplined type scale, a 3-role palette, generous margins. Render bakes it into
templates; advise bakes it into the spec it hands off.

---

## Start with a brief

Before designing anything, settle the five things below. **Infer each from the user's
prompt first; only ask about what's genuinely ambiguous, batch those into one round of
questions, and lead every question with a sensible default the user can just confirm.**
Don't interrogate — a good brief is two or three quick confirmations, not a form.

**1. Deliverable → which mode.** A finished image file → **Render mode**. A layout/spec for
another renderer, or a JSON handoff to a tool/MCP server → **Advise mode**. If unstated,
assume Render (most common); switch to Advise only when the prompt points downstream
("Satori", "OG route", "Figma", "email", "spec", "JSON for…").

**2. Size / format.** Infer from the use case in the prompt before asking — e.g. "OG image"
→ 1200×630, "Instagram post" → 1080×1080, "story" → 1080×1920, "poster" → 1080×1350,
"banner" → 1500×500. If nothing implies a size, *suggest* the closest preset rather than
asking blind:

| Use | Size |
| --- | --- |
| OG / link preview | 1200×630 |
| Instagram square | 1080×1080 |
| Story / Reel / TikTok | 1080×1920 |
| Editorial poster | 1080×1350 |
| Wide banner / header | 1500×500 |
| X / Twitter post | 1600×900 |

**3. Content source.** Where does the copy come from?
- **Inferred** — lift the headline/subhead from the prompt itself (default for one-offs).
- **User-provided** — they give exact copy; use it **verbatim**, don't paraphrase.
- **Batch (CSV / JSON)** — one row → one graphic. In Render mode, generate one data file per
  row and loop the render script; in Advise mode, emit one DesignSpec per row. Confirm which
  columns map to which slot (headline, subhead, tag, image…).

**4. Reference / style.** Does the user have a reference image, or a style to emulate? If so,
**confirm how to use it** — the three handling modes produce very different results:
- **Full recreate** — match the reference's layout *and* copy as closely as the tools allow.
  Always produce an *original interpretation* — never a pixel-for-pixel copy of someone
  else's copyrighted work; rebuild the structure, don't trace the asset.
- **Style only** — borrow the aesthetic (palette, type feel, composition energy) and apply
  it to the user's own content.
- **Same layout, new copy** — keep the reference's structure and styling, swap in different text.

If there's no reference, optionally apply a named common style (Swiss/International,
brutalist, editorial serif, minimal sans, etc.) — suggest one that fits the message rather
than defaulting blandly.

**5. Brand (optional).** Existing colors, fonts, or a logo? If provided, they override
defaults — palette roles ← brand colors, `fonts` ← brand family, logo placed as an image
node/layer. If not, choose a disciplined palette and a safe Google family per the canon.

Once the brief is settled, proceed to the matching mode. Re-confirm later only if a choice
would materially change the output.

---

## Render mode

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

---

## Advise mode

When the deliverable is a *spec* for another renderer or a tool/MCP workflow — not an
image — reason in a single renderer-agnostic intermediate, the **DesignSpec**, then
translate it to the requested target. This keeps the design *decisions* in one place and
makes the target a mechanical mapping.

```json
{
  "canvas":  { "width": 1200, "height": 630, "background": "#0b1020" },
  "palette": { "paper": "#0b1020", "ink": "#f5f5f0", "accent": "#ff5d3b" },
  "type":    { "family": "Inter", "scale": [
    { "role": "eyebrow",  "size": 22, "weight": 600, "tracking": 2,    "lineHeight": 1.2 },
    { "role": "headline", "size": 96, "weight": 800, "tracking": -1.5, "lineHeight": 1.02 },
    { "role": "subhead",  "size": 30, "weight": 400, "tracking": 0,    "lineHeight": 1.3 }
  ]},
  "grid":   { "marginPct": 8, "align": "left", "gap": 24 },
  "layers": [
    { "role": "eyebrow",  "text": "CASE STUDY",            "color": "accent" },
    { "role": "headline", "text": "Design that ships",     "color": "ink" },
    { "role": "subhead",  "text": "A systematic approach", "color": "ink", "opacity": 0.8 },
    { "type": "shape", "shape": "rect", "color": "accent", "at": "right", "w": 220, "h": "100%", "bleed": true }
  ]
}
```

The DesignSpec must satisfy the same canon: exactly one `headline`-role layer (the focal
point), 3–4 type roles with ~1.5–2× jumps, a 3-role palette (extras only tints/shades),
`marginPct` ≥ 6, one alignment system.

**Workflow:** clarify the brief → author the DesignSpec → run the *pre-emit checklist* in
`reference/design-principles.md` and fix anything failing → translate to the target →
return the structure plus a 2–3 line rationale (focal point, why this scale, why these
3 colors). Never translate a spec that fails the checklist.

**Targets** (each reference maps the DesignSpec field-by-field):
- Satori / `@vercel/og` JSX element tree → `reference/satori.md`
- Raw HTML / CSS / email → `reference/html-css.md`
- Figma nodes + design tokens → `reference/figma.md`
- MCP / tool JSON contracts (define-your-own or map onto a tool's schema) → `reference/mcp-contracts.md`

If a render/design **MCP server** is available, discover its tool schema first, then map
the DesignSpec onto it — see `reference/mcp-contracts.md`. If the user actually wants the
image rendered, switch to **Render mode** above — the DesignSpec maps directly onto a
template + data file.

## Reference
- `reference/design-principles.md` — the shared canon: hierarchy, type, color, space,
  composition recipes, plus the render-mode and advise-mode checklists.
- `reference/satori.md` — DesignSpec → Satori / `@vercel/og` element tree.
- `reference/html-css.md` — DesignSpec → HTML + CSS (and email).
- `reference/figma.md` — DesignSpec → Figma nodes & design tokens.
- `reference/mcp-contracts.md` — DesignSpec → MCP / tool JSON contracts.
