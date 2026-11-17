---
name: beam-glass
description: Add Apple-style liquid glass surfaces (panels, buttons, floating bars) to a React or Next.js UI. Use when the user asks for glass, liquid glass, frosted or glassmorphism UI.
---

# Beam Glass

`beam add glass` copied three components into `components/beam/glass/`. They are the project's code now: read them before using them, and change them to fit the design.

```tsx
import { GlassBar, GlassButton, GlassFilter, GlassPanel } from "@/components/beam/glass/glass";
```

## Set up once

Mount the refraction filter once, near the root (for example in `app/layout.tsx`):

```tsx
<body>
  <GlassFilter />
  {children}
</body>
```

## Use

```tsx
<GlassBar tone="dark" className="fixed top-4 left-1/2 -translate-x-1/2">
  <a href="/">Home</a>
  <a href="/pricing">Pricing</a>
</GlassBar>

<GlassPanel tone="dark" className="p-8">
  <h2>Ship faster</h2>
  <GlassButton>Get started</GlassButton>
</GlassPanel>
```

- `tone="light"` (default) for glass over light or mixed content, `tone="dark"` for glass over dark content (white text).
- Tune per surface with CSS variables: `--glass-radius`, `--glass-blur`, `--glass-tint`, `--glass-edge`, `--glass-shadow`.

## How it works

- Every browser gets the frosted base: `backdrop-filter: blur() saturate()`, a tint, an inner edge highlight and a top sheen.
- Chromium also gets refraction: an SVG displacement filter applied to the backdrop (`.beam-glass--liquid`). Safari and Firefox keep the frosted look, which is the correct fallback, not a bug.
- `prefers-reduced-transparency` swaps glass for a solid readable surface; `prefers-reduced-motion` removes button motion.

## Rules (see `references/glass-rules.md`)

- Glass only works over content. Put it above images, gradients or scrolling content, never on a flat solid background, where it only looks grey.
- One glass layer at a time. No glass on glass.
- Text on glass must still pass contrast. Check with `npx usebeam craft review <url>` and raise `--glass-tint` opacity until it passes.
- Use glass for floating, temporary or navigational layers: bars, toolbars, sheets, popovers, a hero card. Not for every card on the page.
