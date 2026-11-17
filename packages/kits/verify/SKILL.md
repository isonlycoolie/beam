---
name: beam-verify
description: Prove a UI build matches its source (a live site, a local page or a design PNG) before calling it done. Use whenever you are recreating, cloning or matching an existing design, after each section you build, and before you report UI work as finished.
---

# Beam Verify

You do not decide by eye whether a build matches. Beam measures it. A section is done when Beam says it passes, not when it looks close.

## When to run it

- After you build or change each section of a page that must match a source.
- Before you tell the user the UI is finished.
- When the user says something "looks off" and you need the exact cause.

## Run it

```bash
npx usebeam verify --reference <source> --target <your build>
```

- `--reference` is the source: a live URL, a `file:` URL, or a PNG of the design.
- `--target` is your running build, for example `http://localhost:3000/pricing`.
- `--breakpoints 1440,768,390` (default) checks desktop, tablet and phone. A PNG reference is checked at its own width.
- `--threshold 0.98` (default) is the score every section must reach.

If Beam says Chromium is missing, run `npx usebeam setup browser` once.

If the Beam MCP server is connected, call the `verify_build` tool with the same values instead.

## Read the result

Beam writes `.beam/verify/<id>/report.md`. Open it. It lists, most important first:

1. **Sections below the threshold**, with their pixel score and position.
2. **Elements missing from the build**, by tag and text.
3. **Values to fix**, each written as `<tag> "text": property should be X, is Y`.

## Fix loop

1. Fix the values in the order the brief lists them. Use the exact expected value. Never round it or pick a "close" design-system token instead.
2. Add every missing element with the same text.
3. Run verify again.
4. Repeat until every breakpoint passes. Do not move on to the next section while this one fails.

## Rules

- Never claim a match without a passing verify run in this session.
- Never lower `--threshold` or add `--pixels-only` to make a run pass. Only do it if the user asks, and say that you did.
- If the source uses something you cannot reproduce (a video, live data, a third-party widget), list it for the user as a known difference instead of hiding it.
- Look at `<width>-diff.png` when the brief is not enough: opaque pixels are the differences.

See `references/reading-the-brief.md` for worked examples.
