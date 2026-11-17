# Reading a Beam verify brief

## Example

```md
## 1440px: fail (96.2% of pixels match)

Sections below the threshold:
- section.hero (y 80 to 760): 91.3%

Missing from the build (1):
- <a> "Contact sales"

Values to fix (3, most important first):
- <h1> "Ship exact UI": fontSize should be 64px, is 56px
- <h1> "Ship exact UI": letterSpacing should be -1.28px, is normal
- <p> "Every value comes from the source.": y should be 252px, is 243px
```

## What each line means and what to do

| Line | Meaning | Fix |
| --- | --- | --- |
| `fontSize should be 64px, is 56px` | Computed font size differs | Set exactly `64px` (or the rem that computes to it) |
| `letterSpacing should be -1.28px, is normal` | Tracking missing | Set `letter-spacing: -1.28px` |
| `y should be 252px, is 243px` | The element sits 9px higher | Usually a cause above it: fix earlier deltas first, then re-run |
| `backgroundColor should be rgb(17, 17, 17)` | Colour differs | Use that exact colour |
| `fontFamily should be "Inter"` | Wrong font loaded | Load the same font file and weights |
| Missing `<a> "Contact sales"` | Element not built | Add it with the same text and tag |

## Position deltas cascade

A wrong height early on the page moves everything below it. Fix font sizes, line heights, paddings and heights from the top down, then re-run before you touch any `x` or `y` deltas.

## Page size differs

`Page size differs: reference 1440x5200, build 1440x4800` means the build is 400px shorter. Find the section with the lowest score: that is usually where the height went.
