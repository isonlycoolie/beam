---
name: beam-clone
description: Rebuild a live web page exactly, pixel for pixel, from measured values. Use when the user gives a URL and asks to clone, copy, replicate, recreate or match a website or page in their project.
---

# Beam Clone

Your job is to reproduce the page **exactly**, not to make something like it. Models drift toward their own taste: rounder numbers, familiar fonts, "cleaner" spacing. Beam removes the guessing: every value you need was measured from the real page. You copy values; you do not choose them.

## 1. Capture

```bash
npx usebeam clone <url>
```

This writes `.beam/clone/<site>/` (or call the `clone_capture` MCP tool):

| File | Use it for |
| --- | --- |
| `brief.md` | Start here: build order, type styles, colours, spacing, radii, shadows |
| `spec.json` | Every visible element per breakpoint: box and computed styles |
| `structure.html` | Rendered HTML: structure, exact copy, alt text, link targets |
| `1440.png`, `768.png`, `390.png` | What it must look like |
| `fonts.css` + `fonts/` | The real font files and their `@font-face` rules |
| `images/`, `stylesheets/` | The original images and CSS |

## 2. Set up the project once

1. Copy `fonts/` and `images/` into the project's public folder and load `fonts.css` (fix the `url()` paths to match).
2. Run the project and keep its local URL ready.

## 3. Build top-down, one section at a time

For section N of the build order in `brief.md`:

1. Read the section in `structure.html` and its elements in `spec.json` (match by `box.y` inside the section's range).
2. Build it with the exact computed values: `fontSize`, `lineHeight`, `letterSpacing`, `fontWeight`, colours, paddings, gaps, radii, shadows, widths and heights.
3. Check it:

   ```bash
   npx usebeam verify --reference <url> --target <local url> --sections 1,...,N
   ```

4. Fix every line in the verify brief, re-run, and only move to section N+1 when it passes at every breakpoint.

## Exactness rules

- **Never invent a value.** If it is not in `spec.json`, `structure.html`, `fonts.css` or the stylesheets, ask the user or list it as an open question.
- **No substitutions.** Do not swap fonts, round `55.44px` to `56px`, or map colours to the nearest Tailwind token. Arbitrary values (`text-[55.44px]`) are correct here.
- **Same text.** Copy text from `structure.html` character for character.
- **Same assets.** Use the saved images and fonts, not look-alikes or icon-library substitutes.
- **Responsive is part of exact.** Compare against all three screenshots and verify every breakpoint.
- **Done means verified.** Never say the clone is finished without a passing `beam verify` on every section.

## When exact is impossible

Videos, live data, logged-in content, canvas animations and third-party widgets may not be reproducible. Build a faithful static stand-in, then tell the user exactly which parts differ and why.

## Ownership

The source's text, images, logos and fonts belong to its owner, and font files have their own licences. Clone your own sites, sites you have permission to copy, or use the clone as a structure reference and swap in your own brand before publishing.

See `references/value-mapping.md` for turning computed styles into CSS and Tailwind.
