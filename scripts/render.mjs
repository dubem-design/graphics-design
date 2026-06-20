#!/usr/bin/env node
// Render a JSON layout template, filled with a data file, to an image.
//
// Usage:
//   node scripts/render.mjs templates/og.json data/og.json out/og.png
//   node scripts/render.mjs templates/og.json data/og.json out/og.webp --format webp
//   node scripts/render.mjs templates/poster.json            # data + out inferred
//
// A template is JSON:
//   { "width": N, "height": N, "fonts": [{ "family": "...", "weight": [..] }], "root": <node> }
// where <node> is a takumi node tree containing {{slot}} placeholders in any string.
//
// A data file is flat JSON: { "slot": "value", "size": 88, ... }.
// - "{{slot}}" inside a longer string does string substitution.
// - a string that is EXACTLY "{{slot}}" is replaced by the raw data value
//   (so numbers/colors/arrays pass through with their real type).
// - {{slot}} with no matching key is left untouched (handy for partial fills).

import { Renderer } from "@takumi-rs/core";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname, extname, basename } from "node:path";

const [, , tplArg, dataArg, outArg, ...rest] = process.argv;
if (!tplArg) {
  console.error("usage: node scripts/render.mjs <template.json> [data.json] [out.png] [--format png|webp|jpeg]");
  process.exit(1);
}

const tplPath = resolve(process.cwd(), tplArg);
const name = basename(tplPath, ".json");
const dataPath = dataArg && !dataArg.startsWith("--") ? resolve(process.cwd(), dataArg) : resolve(process.cwd(), `data/${name}.json`);
const out = outArg && !outArg.startsWith("--") ? resolve(process.cwd(), outArg) : resolve(process.cwd(), `out/${name}.png`);

const flagIdx = rest.indexOf("--format");
const format = flagIdx !== -1 ? rest[flagIdx + 1] : (extname(out).slice(1).toLowerCase().replace("jpg", "jpeg") || "png");

const template = JSON.parse(await readFile(tplPath, "utf8"));
const data = await readFile(dataPath, "utf8").then(JSON.parse).catch(() => ({}));

const EXACT = /^\{\{\s*([\w.]+)\s*\}\}$/;
const INLINE = /\{\{\s*([\w.]+)\s*\}\}/g;
const get = (k) => k.split(".").reduce((o, p) => (o == null ? o : o[p]), data);

function fill(node) {
  if (typeof node === "string") {
    const exact = node.match(EXACT);
    if (exact) {
      const v = get(exact[1]);
      return v === undefined ? node : v;
    }
    return node.replace(INLINE, (m, k) => { const v = get(k); return v === undefined ? m : String(v); });
  }
  if (Array.isArray(node)) return node.map(fill);
  if (node && typeof node === "object") {
    const o = {};
    for (const [k, val] of Object.entries(node)) o[k] = fill(val);
    return o;
  }
  return node;
}

// Load Google Fonts as TTF. IMPORTANT: the css2 endpoint serves woff2 to modern
// user-agents, and takumi silently drops woff2 (text falls back to a default
// sans). Spoofing an ancient UA makes Google return ttf, which takumi honors.
const OLD_UA = "Mozilla/4.0";
async function loadGoogleFont(renderer, family, weights = [400, 700]) {
  const axis = `wght@${[...weights].sort((a, b) => a - b).join(";")}`;
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:${axis}`;
  const css = await fetch(cssUrl, { headers: { "User-Agent": OLD_UA } }).then((r) => r.text());
  const faces = [...css.matchAll(/@font-face\s*\{([^}]*)\}/g)].map((m) => m[1]);
  if (!faces.length) throw new Error(`no @font-face for "${family}" (check the family name)`);
  for (const face of faces) {
    const url = face.match(/src:\s*url\(([^)]+)\)/)?.[1]?.replace(/['"]/g, "").trim();
    if (!url) continue;
    const weight = Number(face.match(/font-weight:\s*(\d+)/)?.[1]) || 400;
    const data = Buffer.from(await fetch(url).then((r) => r.arrayBuffer()));
    await renderer.loadFont({ name: family, weight, data });
  }
}

const renderer = new Renderer();
for (const f of template.fonts ?? []) {
  await loadGoogleFont(renderer, f.family, f.weight ?? [400, 700]);
}

const root = fill(template.root);
const buf = await renderer.render(root, {
  width: template.width ?? 1200,
  height: template.height ?? 630,
  format,
});

await mkdir(dirname(out), { recursive: true });
await writeFile(out, buf);
console.log(`rendered ${template.width}x${template.height} ${format} -> ${out} (${buf.length} bytes)`);
