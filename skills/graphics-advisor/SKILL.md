---
name: graphics-advisor
description: Structure graphic-design specs that meet professional design standards for renderers OTHER than takumi — Satori (JSX/HTML→SVG), raw HTML/CSS, or Figma — and emit clean JSON design contracts for MCP/tool workflows. Use when the user wants a layout/spec, design tokens, or structured data for another editor or render pipeline rather than a finished image file. To actually render an image, use the graphics-render skill.
---

# Graphics Advisor

> One of two skills in this repo. **graphics-advisor** (this one) turns a brief into a
> standards-compliant *spec* for some other renderer or an MCP data contract — it does
> not produce a pixel. **graphics-render** renders finished PNG/WebP images with takumi.
> Advise when the output is a spec, a token set, or structured JSON; render when the
> output is an image file.

Many pipelines need a *correctly designed structure*, not a rendered file: a Satori
element tree for an OG route, HTML/CSS for an email or page, a Figma node payload, or a
JSON contract an MCP server consumes. This skill's job is to take a brief and emit that
structure already obeying the design standards in `reference/design-standards.md`.

## The method: one spec, many targets

Always reason in a single renderer-agnostic intermediate — the **DesignSpec** — then
translate it to the requested target. This keeps the *design decisions* (hierarchy,
palette, scale, spacing) in one place and makes the target a mechanical mapping.

```json
{
  "canvas":  { "width": 1200, "height": 630, "background": "#0b1020" },
  "palette": { "paper": "#0b1020", "ink": "#f5f5f0", "accent": "#ff5d3b" },
  "type":    { "family": "Inter", "scale": [
    { "role": "eyebrow",  "size": 22,  "weight": 600, "tracking": 2,    "lineHeight": 1.2 },
    { "role": "headline", "size": 96,  "weight": 800, "tracking": -1.5, "lineHeight": 1.02 },
    { "role": "subhead",  "size": 30,  "weight": 400, "tracking": 0,    "lineHeight": 1.3 },
    { "role": "caption",  "size": 20,  "weight": 500, "tracking": 1,    "lineHeight": 1.3 }
  ]},
  "grid":   { "marginPct": 8, "align": "left", "gap": 24 },
  "layers": [
    { "role": "eyebrow",  "text": "CASE STUDY",            "color": "accent" },
    { "role": "headline", "text": "Design that ships",     "color": "ink" },
    { "role": "subhead",  "text": "A systematic approach", "color": "ink", "opacity": 0.8 },
    { "type": "shape", "shape": "rect", "color": "accent",
      "at": "right", "w": 220, "h": "100%", "bleed": true }
  ]
}
```

Rules the DesignSpec must always satisfy (enforced from `reference/design-standards.md`):

- **One focal point** — exactly one `headline`-role layer, the largest size in the scale.
- **Disciplined scale** — 3–4 type roles, big deliberate jumps (~1.5–2× between steps),
  one weight ramp. No two roles within ~10% of each other's size.
- **3-role palette** — `paper`, `ink`, `accent`. Any extra color must be a tint/shade of
  these (note it as `accent-20` etc.), never a new hue.
- **Generous margins** — `marginPct` ≥ 6 (≈6–10% of the shorter side); nothing bleeds off
  unless `bleed: true` is explicit and intentional.
- **One alignment system** — a left-aligned column or a centered stack, not both.

Before emitting, run the checklist in `reference/design-standards.md` against the spec.

## Workflow

1. **Clarify the brief**: canvas size + aspect, the single message, brand colors/fonts if any.
2. **Author the DesignSpec** above. Choose sizes from a real ratio, not round guesses.
3. **Self-critique** against the standards checklist. Fix before translating.
4. **Translate** to the requested target using the matching reference:
   - Satori (JSX / `satori`-style element tree) → `reference/satori.md`
   - Raw HTML/CSS (page, email, `@vercel/og` html string) → `reference/html-css.md`
   - Figma (plugin `createFrame` nodes or REST node JSON + tokens) → `reference/figma.md`
   - MCP / tool data contract (schema other tools consume) → `reference/mcp-contracts.md`
5. **Return** the translated structure plus a 2–3 line rationale tying choices to the
   standards (what's the focal point, why this scale, why these 3 colors).

If the user actually wants the image rendered, hand off to **graphics-render** instead —
the DesignSpec maps directly onto that skill's template + data files.

## When MCP tools are involved

If the workflow exposes a design/render MCP server (e.g. a banner or template service),
discover its tools first, then map the DesignSpec fields onto that tool's input schema —
see `reference/mcp-contracts.md` for the field-mapping pattern and how to keep the
standards intact across the boundary.

## Reference
- `reference/design-standards.md` — the canon + the pre-emit checklist (source of truth).
- `reference/satori.md` — DesignSpec → Satori/JSX element tree.
- `reference/html-css.md` — DesignSpec → HTML + CSS.
- `reference/figma.md` — DesignSpec → Figma nodes & design tokens.
- `reference/mcp-contracts.md` — DesignSpec → MCP/tool JSON contracts.
