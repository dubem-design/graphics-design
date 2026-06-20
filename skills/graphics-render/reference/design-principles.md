# Design principles & composition recipes

Longer-form notes to draw on while building specs. The short version lives in `SKILL.md`.

## Hierarchy
- Decide the **one thing** a viewer should read first. Make it the biggest, boldest element.
- Build a ladder: headline → subhead → body → caption. Each step is a clear size/weight drop.
- A reliable scale ratio is ~1.5–2x between levels (e.g. 32 → 56 → 96 → 168).

## Type
- One typeface with a real weight range beats three mismatched families. Space Grotesk, Inter,
  Fraunces, and Playfair Display all load well via `googleFont`.
- Tighten `lineHeight` (≈1.0) on large display text; loosen (≈1.4) on body copy.
- Set `letterSpacing` slightly negative on huge headlines, slightly positive on small all-caps labels.

## Color
- Start with **3 roles**: paper (background), ink (primary text), accent (one highlight).
- Derive variations as tints/shades of those three before introducing a 4th hue.
- Check contrast on the *rendered* image. Mid-grey on cream looks fine in hex and weak in pixels.

## Space & grid
- Pad the canvas generously — 6–10% of the shorter side per edge.
- Use `justifyContent: "space-between"` with a column to pin an eyebrow/headline/footer to the
  edges — a classic editorial poster move (see `specs/poster.mjs`).
- Group related items in their own `container` with a `gap`; separate groups with larger space.

## Composition recipes
- **Editorial poster (4:5 or 2:3):** eyebrow row → oversized multi-line headline → footer meta.
  Left-aligned, one accent word.
- **OG / social card (1200x630):** left-aligned stack, headline + subhead, logo or tag pinned
  bottom-left, optional accent shape bleeding off the right edge.
- **Quote card (1:1):** centered short quote in large serif, attribution below in small caps,
  lots of margin.
- **Banner (wide, e.g. 1500x500):** single line of display type, vertically centered, accent
  block on one side for balance.

## Adding shapes & images
- A colored `container` with fixed width/height and `borderRadius` is your shape primitive.
- Bleed a shape off-canvas by giving it negative `margin` or positioning it larger than the frame.
- `image({ src, style })` takes a URL or data URI; size it with width/height and clip with
  `borderRadius` + `overflow: "hidden"` on a wrapping container.

## Iterate
Render, then critique against this checklist before editing:
1. Is there a single obvious focal point?
2. Are there exactly ~3 colors doing the work?
3. Is anything touching an edge that shouldn't?
4. Does the type scale read as deliberate steps, not random sizes?
5. Could removing an element make it stronger?
