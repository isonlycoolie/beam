# From computed style to code

`spec.json` stores what the browser computed. Write code that computes to the same value.

## Element example

```json
{
  "tag": "h1",
  "text": "I Engineer Systems That Hold Under Pressure",
  "box": { "x": 120, "y": 212, "width": 760, "height": 116.4 },
  "style": {
    "fontFamily": "switzer, \"switzer Fallback\"",
    "fontSize": "55.44px",
    "fontWeight": "500",
    "lineHeight": "58.212px",
    "letterSpacing": "-1.6632px",
    "color": "rgb(255, 255, 255)"
  }
}
```

## Plain CSS

```css
h1 {
  font-family: switzer, "switzer Fallback", sans-serif;
  font-size: 55.44px;
  font-weight: 500;
  line-height: 58.212px;
  letter-spacing: -1.6632px;
  color: rgb(255, 255, 255);
}
```

## Tailwind (arbitrary values, never the nearest token)

```html
<h1 class="font-[switzer] text-[55.44px] font-medium leading-[58.212px] tracking-[-1.6632px] text-[rgb(255,255,255)]">
```

## Values that need care

| Computed | Meaning | Write |
| --- | --- | --- |
| `lineHeight: normal` | Font default | Leave `line-height` unset, or `normal` |
| `letterSpacing: normal` | No tracking | Leave unset |
| `backgroundColor: rgba(0, 0, 0, 0)` | Transparent | No background |
| `fontSize` with many decimals | A fluid or `clamp()` size measured at that width | Use the exact value per breakpoint, or find the `clamp()` in `stylesheets/` |
| `boxShadow` with several layers | Layered shadow | Copy the whole string |
| `backgroundImage: linear-gradient(...)` | Gradient | Copy the whole string |

## Breakpoints

A value can differ between `1440`, `768` and `390`. Look the element up in each breakpoint of `spec.json` (same `path` or same text) and use media queries that switch at the source's breakpoints: find them in `stylesheets/` (`@media (min-width: ...)`).
