# DesignSpec → HTML / CSS

For pages, email headers, or an HTML string fed to a rasterizer (`@vercel/og` html mode,
Puppeteer screenshot, etc.). Unlike Satori you have full CSS — but still hold the design
standards. Emit a `:root` token block so the 3-role palette and scale stay a system.

## Mapping rules
- `palette` → CSS custom properties on `:root` (`--paper`, `--ink`, `--accent`). Tints as
  `--ink-70: color-mix(in srgb, var(--ink) 70%, transparent)`.
- `type.scale` → a small set of utility classes or custom props
  (`--fs-headline`, `--fw-headline`, …). One `font-family` on `body`.
- `canvas` → a fixed-size `.frame` (`width`/`height`) with `box-sizing:border-box` and
  `padding` = margin%. For a responsive page instead, use `max-width` + `aspect-ratio`.
- `grid` → flexbox column (`display:flex; flex-direction:column`), `align-items` from
  `align`, `gap` from `gap`.
- `layers` → elements in order; a bleeding `shape` → `position:absolute` child of a
  `position:relative` frame.

## Standards in CSS
- Set `line-height` tight on display (`1.02`) and loose on body (`1.3`).
- Use `letter-spacing` per the scale; negative on the headline.
- Prefer `opacity`/`color-mix` for secondary text over inventing a grey.
- Keep `padding` on the frame ≥ the spec's `marginPct`; never let text reach the edge.

## Example
```html
<style>
  :root {
    --paper:#0b1020; --ink:#f5f5f0; --accent:#ff5d3b;
    --ink-80: color-mix(in srgb, var(--ink) 80%, transparent);
  }
  .frame{
    width:1200px; height:630px; box-sizing:border-box; padding:80px;
    background:var(--paper); color:var(--ink); position:relative;
    font-family:"Inter",sans-serif;
    display:flex; flex-direction:column; justify-content:center; align-items:flex-start; gap:16px;
  }
  .eyebrow { font-size:22px; font-weight:600; letter-spacing:2px; color:var(--accent); margin:0; }
  .headline{ font-size:96px; font-weight:800; letter-spacing:-1.5px; line-height:1.02; margin:0; }
  .subhead { font-size:30px; font-weight:400; line-height:1.3; color:var(--ink-80); margin:0; }
  .bleed   { position:absolute; top:0; right:0; width:220px; height:100%; background:var(--accent); }
</style>
<div class="frame">
  <p class="eyebrow">CASE STUDY</p>
  <h1 class="headline">Design that ships</h1>
  <p class="subhead">A systematic approach</p>
  <div class="bleed"></div>
</div>
```

For **HTML email** instead, inline the styles and use a table layout (clients strip
`<style>` and ignore flexbox) — but derive every value from the same DesignSpec.
