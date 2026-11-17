---
name: beam-figma
description: Turn a Figma frame into code that matches it exactly, then prove it with a design drift check. Use when the user shares a Figma frame, a .beam.json export or a figma.com link and asks to build, implement or match the design.
---

# Beam Figma

The design is the spec. You build what the frame says, with the exact values Figma holds: no "close enough" spacing, no swapped fonts, no colours rounded to a nearby token.

## 1. Get the design

Pick the path the user has:

**A. The Beam Figma plugin (any Figma plan, no token).** The user selects the frame in Figma, runs the Beam plugin, clicks **Export selection**, and saves `<frame>.beam.json` into the project. Then:

```bash
npx usebeam figma import <frame>.beam.json
```

(or the `figma_import_bundle` MCP tool). Free Figma plans allow very few API calls a month, so this path is the default.

**B. A Figma link with a saved token.** If `npx usebeam doctor` shows a Figma token, run `npx usebeam inspect <figma url>` for the context and `npx usebeam export <figma url>` for renders and assets.

If neither is available, ask the user for an export. Never rebuild a design from a screenshot alone.

## 2. Read the brief

`.beam/figma/<frame>/brief.md` lists the build order (top-level layers), every text style, colours, spacing (auto-layout padding and gaps), radii, shadows and the file's variables. The folder also has:

- `frame.json`: the layer tree with auto layout (`layout.mode` row or column, `padding`, `gap`, `justify`, `align`)
- `frame.png`, `frame@2x.png`: the target look
- `images/`, `svgs/`: image fills and icons as SVG. Use these files, not icon-library look-alikes.
- `variables.json`: design tokens with values per mode

## 3. Build

- Map auto layout to flexbox: `row` or `column` gives `flex-direction`, `padding` and `gap` map one to one, `justify` (min, center, max, space_between) maps to `justify-content`, `align` to `align-items`.
- Use the exact text values: `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`, `color`, and the text itself character for character.
- When a value equals a variable, use the project's token for that variable. When no token has the identical value, use the raw value. Never pick the nearest one.

## 4. Verify (design drift check)

```bash
npx usebeam verify --reference figma:.beam/figma/<frame> --target <local url>
```

It compares pixels per section with `frame.png` and every text layer's font, colour, size and vertical position with the page. Fix each line of the brief, re-run, and repeat until it passes. Build and verify section by section with `--sections 1,...,N`.

## Rules

- Never call a screen done without a passing verify against its frame.
- The frame width is the breakpoint being checked. For other breakpoints, ask the user for the matching frames.
- If the design is missing a state (hover, error, empty), ask. Do not design it yourself unless the user says to.

See `references/auto-layout.md` for auto layout mapping examples.
