---
name: beam-craft
description: Build new UI that looks designed, not generated, and runs fast. Use when creating or restyling pages, components or layouts without a source design to copy, and before calling any UI work finished.
---

# Beam Craft

> **Draft.** The principles in `references/principles.md` are a first version and will change. Follow them, and tell the user when one does not fit their product.

Generated UIs look alike: centred everything, purple gradients, gradient headline text, emoji bullets, equal-weight cards, a dozen font sizes, padding that is never quite even. Craft is the set of decisions that avoids that, plus a check that measures the result.

## Before you build

1. **Read the room.** Look at the project's existing tokens, fonts, components and pages. Extend them; do not start a parallel style.
2. **Pick the scale once.** Choose a type scale (5 to 7 sizes) and a spacing scale (4px based) for the work and write them down in the code (CSS variables or Tailwind theme). Every value you use comes from these scales.
3. **Decide the hierarchy.** For each screen, name the one thing the user must see first, the second, and what can recede. Size, weight and contrast follow that order, not decoration.
4. **Start from a screen.** Building a dashboard, an app shell with a sidebar, a login or a sign-up page? Pick the closest screen in `references/screens.md` (or `screens_list` over MCP), install it and change its data and copy. Do not lay those pages out from scratch.

## While you build

Follow `references/principles.md`. The short version:

- One typeface, two at most. Contrast comes from size and weight, not more fonts.
- Left-align text by default. Centre only short headings and single calls to action.
- One accent colour, used rarely and on purpose. Neutrals do most of the work.
- Real content and real copy. No lorem ipsum, no "Unlock the power of".
- Fast by default: sized images (`width`/`height`), modern formats, lazy below the fold, no layout shift, few fonts and weights.
- Accessible by default: contrast at least 4.5:1 for body text, visible focus, targets at least 24px (44px on touch), semantic HTML, one `h1`.

Check `references/anti-generic.md` before you finish.

## Check it

```bash
npx usebeam craft review <local url>
```

It measures text contrast against the real background, touch target sizes, sideways scrolling, missing alt text, heading order, font and size sprawl, off-grid spacing, page weight and generic-AI patterns at desktop and phone widths, and writes `.beam/craft/<id>/review.md`.

Fix every **high** finding. Fix **medium** findings unless the user decides otherwise. Re-run until no high findings remain.

## Rules

- Never call UI work finished with open high findings.
- When you break a principle on purpose, say which one and why.
