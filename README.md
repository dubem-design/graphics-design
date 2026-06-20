# graphics-design

A Claude Agent Skill for creating polished static graphics — **posters, social/OG
images, quote cards, and banners** — by filling a JSON layout template with data and
rendering it to PNG/WebP with the [takumi](https://takumi.kane.tw) engine. No headless
browser required.

## Install

Add the skill to your agent with [skills.sh](https://skills.sh):

```bash
npx skills add dubem-design/graphics-design
```

## How it works

Graphics are defined as **JSON templates + data**:

- A **template** (`templates/*.json`) is a takumi node tree with `{{slot}}` placeholders.
  It owns the layout, type scale, and spacing.
- A **data file** (`data/*.json`) fills the slots — copy, colors, sizes.
- The **render script** interpolates data into the template and produces an image.

This separation means you can restyle by editing the template, or re-skin/re-copy by
editing only the data — without touching layout.

## Quick start

```bash
npm install                                   # once: installs takumi
node scripts/render.mjs templates/og.json     # data/og.json + out/og.png inferred
```

Explicit paths and format:

```bash
node scripts/render.mjs templates/og.json data/og.json out/og.webp --format webp
```

## Templates included

| Template      | Size      | Use                         |
| ------------- | --------- | --------------------------- |
| `og.json`     | 1200×630  | social / link-preview card  |
| `poster.json` | 1080×1350 | editorial poster            |
| `quote.json`  | 1080×1080 | centered serif quote card   |
| `banner.json` | 1500×500  | wide banner with accent     |

Start from the closest one, copy it to a new name, and adjust.

## Docs

See [`SKILL.md`](./SKILL.md) for the full template anatomy, slot rules, takumi gotchas,
and design principles, plus [`reference/design-principles.md`](./reference/design-principles.md)
for longer composition notes.
