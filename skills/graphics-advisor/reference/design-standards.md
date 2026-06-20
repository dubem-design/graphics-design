# Design standards (source of truth)

Every DesignSpec this skill emits — for any target — must satisfy these. The same canon
backs the `graphics-render` skill; here it governs structures other renderers consume.

## Hierarchy
- Decide the **one thing** read first. It is the biggest, boldest layer — the focal point.
- Build a ladder: eyebrow → headline → subhead → caption. Each step is a clear drop.
- Reliable scale ratio ~1.5–2× between levels (e.g. 22 → 30 → 96, or 32 → 56 → 96 → 168).
- No two type roles within ~10% of each other's size — that reads as indecision.

## Type
- One family with a real weight range beats three mismatched ones. Inter, Space Grotesk,
  Fraunces, Playfair Display are safe, widely available choices.
- Tighten `lineHeight` (~1.0) on large display text; loosen (~1.3–1.4) on body copy.
- Negative `letterSpacing` on huge headlines; slightly positive on small all-caps labels.

## Color
- **3 roles**: paper (background), ink (primary text), accent (one highlight).
- Extra values must be tints/shades of those three (label them `ink-60`, `accent-20`),
  never a 4th hue.
- Judge contrast on the *rendered* result, not the hex. Mid-grey on cream is weak in pixels.
- Body/secondary text is usually ink at 70–85% opacity, not a separate grey.

## Space & grid
- Margin ≥ 6–10% of the shorter side, every edge. Crowded edges read as amateur.
- Pin eyebrow/headline/footer to edges with a space-between column for editorial balance.
- Group related layers with a small `gap`; separate groups with larger space.
- Nothing touches or bleeds off an edge unless it's an intentional, flagged accent bleed.

## Composition recipes
- **OG / social (1200×630):** left-aligned stack, headline + subhead, tag pinned
  bottom-left, optional accent shape bleeding off the right edge.
- **Editorial poster (4:5, 2:3):** eyebrow row → oversized multi-line headline → footer
  meta. Left-aligned, one accent word.
- **Quote (1:1):** centered short quote in large serif, attribution in small caps below,
  lots of margin.
- **Banner (wide, ~1500×500):** single line of display type vertically centered, accent
  block on one side for balance.

## Pre-emit checklist (run before returning any spec)
1. Is there a single obvious focal point (exactly one headline-role layer, largest size)?
2. Are exactly ~3 colors doing the work, extras only tints/shades?
3. Does the type scale read as deliberate steps, not random sizes?
4. Is every layer inside the margins (nothing touching an edge unless a flagged bleed)?
5. Is the whole thing on one alignment system (a column or a centered stack, not both)?
6. Could removing an element make it stronger? If yes, remove it.

If any answer is "no," fix the DesignSpec — do not translate a failing spec to a target.
