# Figma auto layout to CSS

`frame.json` stores auto layout as:

```json
"layout": { "mode": "column", "padding": [32, 24, 32, 24], "gap": 12, "justify": "min", "align": "center" }
```

`padding` is `[top, right, bottom, left]`.

## Mapping

| Figma | CSS | Tailwind |
| --- | --- | --- |
| `mode: row` | `display:flex; flex-direction:row` | `flex flex-row` |
| `mode: column` | `display:flex; flex-direction:column` | `flex flex-col` |
| `gap: 12` | `gap:12px` | `gap-[12px]` |
| `padding: [32,24,32,24]` | `padding:32px 24px` | `px-[24px] py-[32px]` |
| `justify: min / center / max` | `justify-content:flex-start / center / flex-end` | `justify-start / justify-center / justify-end` |
| `justify: space_between` | `justify-content:space-between` | `justify-between` |
| `align: min / center / max` | `align-items:flex-start / center / flex-end` | `items-start / items-center / items-end` |
| `align: baseline` | `align-items:baseline` | `items-baseline` |

## Sizes

A child's `box.width` and `box.height` are its rendered size. Use them for fixed-size layers (icons, avatars, images). For text and containers that hug or fill, let flex size them and confirm with verify, so the layout stays responsive.

## Paints

- `fills` are CSS paints, topmost last: `rgb(...)`, `linear-gradient(...)` or `image:<hash>` (the file is `images/<hash>.png`).
- `stroke` maps to `border: <width>px solid <color>`.
- `radius` is a ready CSS `border-radius`.
- `shadow` is a ready CSS `box-shadow`.
