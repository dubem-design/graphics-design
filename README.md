# graphics-design

A Claude Agent Skill for professional static graphics, with **two modes**:

- **Render** — produce an actual PNG/WebP/JPEG file by filling a JSON template with data
  and rendering it through the [takumi](https://takumi.kane.tw) engine (no headless browser).
- **Advise** — structure a standards-compliant design *spec* for another renderer
  (Satori, HTML/CSS, Figma) or a JSON contract for a tool/MCP workflow — without rendering.

Both modes enforce the same design canon: one focal point, a disciplined type scale, a
3-role palette, generous margins. Render bakes it into templates; advise bakes it into the
spec it hands off.

Each job **starts with a short brief** — the skill infers what it can from your prompt and
only asks about what's ambiguous: deliverable (image vs spec), size/format, content source
(inferred / pasted / CSV batch), reference-or-style handling (full recreate, style only, or
same layout with new copy), and any brand colors/fonts/logo. See [`SKILL.md`](./SKILL.md#start-with-a-brief).

## Install

From [skills.sh](https://skills.sh):

```bash
npx skills add dubem-design/graphics-design
```

## Render mode

```bash
npm install                                   # once: installs takumi
node scripts/render.mjs templates/og.json     # data/og.json + out/og.png inferred
```

Explicit paths/format:

```bash
node scripts/render.mjs templates/og.json data/og.json out/og.webp --format webp
```

Templates: `og` (1200×630), `poster` (1080×1350), `quote` (1080×1080), `banner` (1500×500).

## Advise mode

Reason in one renderer-agnostic **DesignSpec** (canvas + palette + type scale + grid +
layers), validate it against the pre-emit checklist, then translate to the target:

- Satori / `@vercel/og` → [`reference/satori.md`](./reference/satori.md)
- HTML / CSS / email → [`reference/html-css.md`](./reference/html-css.md)
- Figma nodes + tokens → [`reference/figma.md`](./reference/figma.md)
- MCP / tool JSON contracts → [`reference/mcp-contracts.md`](./reference/mcp-contracts.md)

## More

See [`SKILL.md`](./SKILL.md) for the full mode guide, template anatomy, takumi rules, and
the DesignSpec format, and [`reference/design-principles.md`](./reference/design-principles.md)
for the shared design canon and both checklists.
