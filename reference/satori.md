# DesignSpec → Satori

[Satori](https://github.com/vercel/satori) turns a JSX-like element tree into SVG (then
usually PNG via resvg, e.g. in `@vercel/og` / Next.js OG routes). It supports a **flexbox
subset**: every element needs an explicit `display: flex` once it has multiple children,
and there is no `block` flow. Map the DesignSpec onto that model.

## Mapping rules
- `canvas` → the root element's `width`/`height`/`backgroundColor`, plus
  `display:flex; flexDirection:column; padding: <marginPct% of short side>`.
- `palette` roles → literal CSS color strings at point of use (Satori has no variables).
  Keep them in a `const palette = {…}` so they stay a 3-role system in code.
- `type.scale[role]` → `fontSize`, `fontWeight`, `letterSpacing`, `lineHeight` on the text
  element for that role.
- `grid.align` → `alignItems` (`flex-start` for left, `center` for centered).
- `grid.gap` → `gap` on the column (Satori supports `gap`).
- `layers` → child elements in order. A `shape` with `bleed:true` → an absolutely
  positioned div (`position:absolute`, negative offset) inside a `position:relative` root.

## Satori gotchas (verified)
- Each element with >1 child **must** set `display:flex` or Satori throws.
- No `\n` line breaks inside one text node — use separate elements or `whiteSpace:pre`.
- Fonts must be passed as buffers in the `fonts` option; `fontFamily` must match a
  provided `name`. No system fonts.
- `backgroundImage` gradients work; many other CSS features do not — keep it to the
  flex/spacing/color/border-radius subset.

## Example
DesignSpec headline + subhead + accent bleed → Satori element object:

```jsx
const palette = { paper: "#0b1020", ink: "#f5f5f0", accent: "#ff5d3b" };

const tree = {
  type: "div",
  props: {
    style: {
      width: 1200, height: 630, backgroundColor: palette.paper,
      display: "flex", flexDirection: "column", justifyContent: "center",
      alignItems: "flex-start", padding: 80, position: "relative",
      fontFamily: "Inter",
    },
    children: [
      { type: "div", props: { style: { fontSize: 22, fontWeight: 600, letterSpacing: 2, color: palette.accent }, children: "CASE STUDY" } },
      { type: "div", props: { style: { fontSize: 96, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1.02, color: palette.ink, marginTop: 16 }, children: "Design that ships" } },
      { type: "div", props: { style: { fontSize: 30, fontWeight: 400, lineHeight: 1.3, color: palette.ink, opacity: 0.8, marginTop: 16 }, children: "A systematic approach" } },
      { type: "div", props: { style: { position: "absolute", top: 0, right: 0, width: 220, height: "100%", backgroundColor: palette.accent } } },
    ],
  },
};
// satori(tree, { width: 1200, height: 630, fonts: [{ name: "Inter", data: interBuf, weight: 400 }, …] })
```

If the user is on `@vercel/og` / Next.js, the same tree expresses cleanly as JSX inside
`new ImageResponse(<div style={…}>…</div>, { width, height, fonts })`.
