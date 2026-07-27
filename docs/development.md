# Beam Development

## Requirements

- Node.js `>=22.12.0`
- pnpm `11.10.0`
- TypeScript-first implementation

## Commands

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
pnpm format:check
```

## Boundaries

- `packages/core` owns product logic.
- `packages/cli` owns human command behavior.
- `packages/mcp` owns agent tool behavior.
- No direct Figma calls outside `FigmaClient`.
- No credentials in project files.
- No Rust in v1.

## Release Discipline

Use topic branches, small commits, focused tests, and deterministic fixtures. Keep commits below 100 insertions whenever practical.
