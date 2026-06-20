# graphics-design

A repo of two complementary Claude Agent Skills for professional static graphics. One
**renders** finished images; the other **advises** — structuring standards-compliant
specs for other renderers and tool/MCP workflows.

| Skill | Role | Output |
| ----- | ---- | ------ |
| [`graphics-render`](./skills/graphics-render) | Generate the actual graphic | a PNG/WebP/JPEG file (via the takumi engine, no browser) |
| [`graphics-advisor`](./skills/graphics-advisor) | Structure the design to standard for *other* pipelines | a Satori/HTML/Figma spec or an MCP JSON contract |

Both enforce the same design canon — one focal point, a disciplined type scale, a 3-role
palette, generous margins. `graphics-render` bakes it into templates; `graphics-advisor`
bakes it into the spec it hands to another renderer.

## Install

Both skills live in one repo on [skills.sh](https://skills.sh):

```bash
npx skills add dubem-design/graphics-design
```

The CLI discovers both skills under `skills/`; load whichever fits the task (or both).

## When to use which

- **Want an image file?** → `graphics-render`. Fill a JSON template with data, render.
- **Want a layout/spec for Satori, an OG route, HTML/email, Figma, or another tool/MCP
  server?** → `graphics-advisor`. It emits a renderer-agnostic DesignSpec and translates
  it to the target.

## graphics-render quick start

```bash
cd skills/graphics-render
npm install                                   # once: installs takumi
node scripts/render.mjs templates/og.json     # data/og.json + out/og.png inferred
```

Templates included: `og` (1200×630), `poster` (1080×1350), `quote` (1080×1080),
`banner` (1500×500). See [`skills/graphics-render/SKILL.md`](./skills/graphics-render/SKILL.md).

## graphics-advisor at a glance

Reason in one **DesignSpec** (canvas + palette + type scale + grid + layers), validate it
against the standards checklist, then translate to the requested target:

- Satori / `@vercel/og` → [`reference/satori.md`](./skills/graphics-advisor/reference/satori.md)
- HTML / CSS / email → [`reference/html-css.md`](./skills/graphics-advisor/reference/html-css.md)
- Figma nodes + tokens → [`reference/figma.md`](./skills/graphics-advisor/reference/figma.md)
- MCP / tool JSON contracts → [`reference/mcp-contracts.md`](./skills/graphics-advisor/reference/mcp-contracts.md)

See [`skills/graphics-advisor/SKILL.md`](./skills/graphics-advisor/SKILL.md).
