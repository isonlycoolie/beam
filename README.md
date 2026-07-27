# Beam

Beam is an open-source design intelligence bridge for coding agents. It turns Figma frames into structured implementation context, rendered design references, assets, tokens, and warnings so agents can build UI from inspectable data instead of screenshots and guesswork.

Beam is local-first by default. The open-source core runs from your machine, keeps credentials local, and uses the same core APIs for the CLI and MCP server.

## Why Beam

Design-to-code workflows usually lose important context between Figma and the coding agent. Beam narrows that gap by fetching design data, simplifying the noisy Figma node tree, caching snapshots, and producing compact briefs that are easier for agents to use.

Beam is not an IDE, design editor, or code generator. It is infrastructure for repeatable design handoff.

## Core Flow

```bash
beam login
beam doctor
beam inspect <figma-url>
beam export <figma-url>
beam mcp
```

The early product focuses on proving the local bridge:

- Parse Figma file and frame URLs.
- Load local Figma credentials.
- Respect API limits with scheduling, caching, and retries.
- Store versioned snapshots.
- Generate implementation briefs from Figma nodes.
- Export rendered assets and manifests.
- Expose the same core through CLI commands and MCP tools.

## Workspace

```txt
packages/core          Shared contracts, Figma client, cache, snapshots, simplifier, assets
packages/cli           Beam command-line interface
packages/mcp           MCP server surface
packages/cloud-client  Placeholder for future cloud client work
packages/test-kit      Shared testing utilities
apps/                  Future cloud API and dashboard apps
fixtures/              Deterministic local test fixtures
```

## Development

Beam uses Node.js 22.12+ and pnpm.

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
pnpm format:check
```

The repository is TypeScript-first. Core behavior should stay deterministic, tested without live Figma credentials, and independent from Beam Cloud.

## Project Rules

- Keep Figma API complexity inside `packages/core`.
- Keep CLI and MCP code thin over the shared core.
- Do not store credentials in project files.
- Do not bypass Figma limits or permissions.
- Do not make local open-source behavior depend on hosted services.
- Keep commits focused and reviewable.

## Status

Beam is under active implementation. The current work is organized around MVP sprints for the local CLI, core contracts, cache, snapshots, asset export, and MCP server.

## License

License information has not been added yet.
