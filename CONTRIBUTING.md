# Contributing

Thanks for helping improve Beam.

## Development Setup

Beam uses Node.js 22.12+ and pnpm.

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
pnpm format:check
```

## Contribution Rules

- Keep changes focused on one topic.
- Add tests for behavior changes.
- Keep CLI, MCP, and core boundaries clean.
- Do not commit credentials, `.beam/`, generated packages, or private docs.
- Do not add cloud or enterprise behavior to the local free core.

## Pull Requests

Each pull request should include:

- Summary.
- Scope.
- Tests run.
- Known limitations.

Use clear branch names such as `feature/url-parser`, `fix/config-validation`, or `docs/quickstart`.
