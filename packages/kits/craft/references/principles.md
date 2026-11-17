# Craft principles (draft, to be agreed)

Each principle says what to do, why, and how Beam checks it. Status markers: **agreed** or **draft**. All are draft until reviewed.

## Type

1. **One family, two at most** (draft). A display face plus a text face is the ceiling. *Check:* `craft review` flags more than 2 families.
2. **A real scale** (draft). 5 to 7 sizes from a ratio (1.2 to 1.333), for example 14, 16, 20, 24, 32, 48, 64. *Check:* more than 8 sizes is flagged.
3. **Tighter headings, looser body** (draft). Large headings use line height 1.0 to 1.2 and slight negative tracking (about -0.02em). Body uses 1.5 to 1.7 and normal tracking.
4. **Measure** (draft). Body text runs 60 to 75 characters per line (`max-width: 65ch`).

## Space

5. **4px grid** (draft). Every padding, margin and gap is a multiple of 4. *Check:* off-grid values are counted.
6. **Group by proximity** (draft). Space inside a group is smaller than space between groups, at least 2x.
7. **Generous sections** (draft). Desktop sections breathe: 96 to 160px vertical padding; phones 56 to 80px.

## Colour

8. **Neutrals first** (draft). 90% of the surface is neutral. One accent for primary actions and key data.
9. **Contrast** (draft). Body text at least 4.5:1, large text at least 3:1, against the real background. *Check:* measured per element.
10. **No default palette** (draft). Do not ship framework defaults (Tailwind indigo-500, shadcn slate) as the brand.

## Layout and hierarchy

11. **Left-aligned reading** (draft). Paragraphs and lists are left-aligned. Centred layouts only for short hero moments.
12. **Unequal emphasis** (draft). Not every card is the same size and weight; the primary item leads.
13. **No sideways scroll** (draft). Nothing overflows at 390px. *Check:* overflow is measured.

## Interaction

14. **Targets** (draft). At least 24x24px, 44x44px on touch. *Check:* measured per breakpoint.
15. **Visible focus** (draft). Every interactive element shows a clear focus ring.
16. **Motion with purpose** (draft). 150 to 300ms, ease-out, respect `prefers-reduced-motion`.

## Performance

17. **Weight budget** (draft). Under 1.5MB per page on first load. *Check:* over 2.5MB is flagged.
18. **Images** (draft). AVIF or WebP, sized per breakpoint, explicit width and height, lazy below the fold.
19. **Fonts** (draft). At most 4 font files, `font-display: swap`, preload the one used above the fold.

## Accessibility

20. **Semantics** (draft). One `h1`, no skipped heading levels, `lang` on `<html>`, alt text on images. *Check:* all measured.
