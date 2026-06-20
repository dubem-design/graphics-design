# DesignSpec → MCP / tool data contracts

When the workflow hands the design off to another tool — an MCP render server, a template
service, a queue, another agent — the deliverable is **structured JSON that already
encodes the standards**, plus a faithful mapping onto that tool's input schema.

## Two cases

### 1. You define the contract
Emit the DesignSpec itself as the contract and publish a JSON Schema so downstream tools
validate it. Keep the standards machine-checkable:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["canvas", "palette", "type", "grid", "layers"],
  "properties": {
    "palette": {
      "type": "object",
      "required": ["paper", "ink", "accent"],
      "additionalProperties": { "type": "string" },
      "description": "Exactly 3 roles; extra keys must be tints/shades (e.g. ink-70)."
    },
    "type": {
      "properties": {
        "scale": { "type": "array", "minItems": 3, "maxItems": 4,
          "description": "3–4 roles, ~1.5–2x size jumps, one weight ramp." }
      }
    },
    "grid": {
      "properties": { "marginPct": { "type": "number", "minimum": 6 } }
    },
    "layers": {
      "description": "Exactly one layer with role 'headline' (the focal point).",
      "type": "array"
    }
  }
}
```
Encode what you can as constraints (`minimum`, `minItems/maxItems`, `required`); state the
rest (single focal point, tints-only extras) in `description` so a reviewing agent enforces it.

### 2. The tool defines the contract
Discover the tool's schema first, then map DesignSpec fields onto it — do not assume field
names. With MCP tools available in this session, that means `learn_tools`/`get_tool_catalog`
(or the server's documented schema) before constructing the call. Typical mapping:

| DesignSpec            | Common tool field                          |
| --------------------- | ------------------------------------------ |
| `canvas.width/height` | `width`/`height`, or a named `size`/preset |
| `palette.*`           | `colors`/`theme`/`brand` object or tokens  |
| `type.family`         | `font`/`fontFamily`                         |
| `layers[].text`       | named `slots`/`fields`/`variables`         |
| `layers[].role`       | a template/layer id to fill                |

Map by **meaning, not name**: a `{{headline}}` slot, a `title` field, and a `layers[0].text`
all receive the focal-point string. When the target only exposes flat slots (e.g. a banner
template's `title`/`subtitle`), flatten the DesignSpec into them but keep the hierarchy
intact — the largest slot gets the headline, never a secondary line.

## Crossing the boundary without losing the standards
- Run the `design-standards.md` checklist on the DesignSpec **before** flattening; a lossy
  target can't fix a spec that was already wrong.
- If the tool can't express something the standard needs (e.g. no per-layer letter-spacing),
  say so in the rationale rather than silently dropping it.
- Return both the tool call you'd make **and** the DesignSpec it came from, so the design
  intent is auditable and re-translatable to another target later.
