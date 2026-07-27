# Beam MVP Release Checklist

## Required Checks

- `pnpm build` passes.
- `pnpm test` passes.
- `pnpm typecheck` passes.
- `pnpm format:check` passes.
- Golden fixtures are deterministic.
- Built CLI keeps the shebang.
- Package exports resolve.
- `beam init --print` works.
- MCP server starts over stdio.

## Security Checks

- No credentials are tracked.
- No `.beam/cache` files are tracked.
- No signed image URLs are committed.
- No live Figma validation is claimed without credentials.

## Known MVP Limits

- PAT auth is the MVP path.
- Automatic MCP client config writes are deferred.
- Beam Cloud, billing, SSO, team roles, enterprise proxy, and audit exports are deferred.
