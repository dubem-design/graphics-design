# DesignSpec → Figma

Two ways to land a DesignSpec in Figma: **plugin code** (Figma Plugin API, runs in-app and
can create nodes live) and a **portable node/token JSON** (for the REST API or a design
handoff). Both want the spec expressed as a frame with auto-layout and named tokens.

## Token mapping (do this first)
Emit the 3-role palette and type scale as Figma-style variables/styles so the result is a
system, not loose values:

```json
{
  "collections": {
    "color": { "paper": "#0b1020", "ink": "#f5f5f0", "accent": "#ff5d3b", "ink/80": "rgba(245,245,240,0.8)" }
  },
  "textStyles": {
    "eyebrow":  { "fontFamily": "Inter", "fontWeight": 600, "fontSize": 22, "letterSpacing": 2,    "lineHeight": "120%" },
    "headline": { "fontFamily": "Inter", "fontWeight": 800, "fontSize": 96, "letterSpacing": -1.5, "lineHeight": "102%" },
    "subhead":  { "fontFamily": "Inter", "fontWeight": 400, "fontSize": 30, "letterSpacing": 0,    "lineHeight": "130%" }
  }
}
```

## Frame mapping
- `canvas` → a `FRAME` with `width`/`height`, `fills` = paper, auto-layout enabled.
- `grid` → auto-layout: `layoutMode:"VERTICAL"`, `itemSpacing` = gap,
  `counterAxisAlignItems` from `align` (`MIN` left / `CENTER`), `paddingLeft/Right/Top/Bottom`
  = marginPct of the short side.
- `type.scale[role]` → a `TEXT` node bound to the matching text style; `fills` = the layer's color token.
- `layers` order → child order. A `bleed` shape → a `RECTANGLE` with absolute position
  (`layoutPositioning:"ABSOLUTE"`), `constraints` pinned right, extending to/over the edge.

## Plugin API sketch
```js
const f = figma.createFrame();
f.resize(1200, 630);
f.fills = [{ type: "SOLID", color: hexToRgb01("#0b1020") }];
f.layoutMode = "VERTICAL";
f.counterAxisAlignItems = "MIN";
f.itemSpacing = 16;
f.paddingLeft = f.paddingRight = f.paddingTop = f.paddingBottom = 80;

await figma.loadFontAsync({ family: "Inter", style: "Bold" });
const h = figma.createText();
h.fontName = { family: "Inter", style: "Bold" };
h.fontSize = 96;
h.letterSpacing = { unit: "PIXELS", value: -1.5 };
h.characters = "Design that ships";
h.fills = [{ type: "SOLID", color: hexToRgb01("#f5f5f0") }];
f.appendChild(h);
// …eyebrow + subhead the same way; bleed rect with layoutPositioning:"ABSOLUTE"
```

Note Figma colors are 0–1 RGB (`{r,g,b}`), not hex or 0–255 — convert at the boundary.
Always `loadFontAsync` before setting text. Keep the headline the only node at the top of
the scale so the focal-point rule survives the translation.
