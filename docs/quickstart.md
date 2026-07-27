# Beam MVP Quickstart

Beam is a local-first bridge from Figma frames to coding agents.

## Install

```bash
npm install -g @beam/client
beam doctor
```

Project-local usage is also supported:

```bash
npm install --save-dev @beam/client
npx @beam/client doctor
```

## Authenticate

MVP uses a Figma personal access token.

```bash
beam login --token <figma-token>
beam doctor
```

Credentials are stored in `~/.beam/credentials.json`. Do not place tokens in project files.

## Inspect And Export

```bash
beam inspect <figma-url>
beam inspect <figma-url> --json
beam export <figma-url>
beam snapshots list
beam mappings list
beam debug bundle
```

`inspect` returns implementation context. `export` writes local visual assets and an asset manifest.

## Agent Setup

```bash
beam init --print
beam mcp
```

`beam init --print` prints manual MCP config. Automatic client config writes are deferred until client paths are documented.

## Compare

```bash
beam compare <figma-url> <local-url>
```

Compare captures a local page screenshot and reports a basic visual score.
