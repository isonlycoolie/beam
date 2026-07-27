# Beam Troubleshooting

## Missing Credentials

Run:

```bash
beam login --token <figma-token>
beam doctor
```

Beam must not print or store the token in project files.

## Invalid Figma URL

Use a Figma file or design URL:

```txt
https://www.figma.com/design/<fileKey>/<name>?node-id=1-2
```

Beam normalizes `node-id=1-2` to `1:2`.

## Rate Limited

Beam respects Figma rate limits. Use cached data when available or retry after the upstream `Retry-After` value.

## MCP Setup

If automatic setup is unavailable, run:

```bash
beam init --print
```

Add the printed `mcpServers.beam` config to the agent manually.

## Live Validation

Unit and fixture tests do not use live Figma credentials. Do not claim live validation unless a real token and URL were used.

## Debug Bundle

Run:

```bash
beam debug bundle
```

The default bundle excludes credentials, raw Figma payloads, exported images, and signed URLs.
