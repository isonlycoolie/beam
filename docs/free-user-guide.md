# Beam Free User Guide

Beam Free is the local open-source product. It does not require a Beam account.

## Setup

```bash
npm install -g usebeam
beam login --token <figma-token>
beam doctor
```

Credentials stay in `~/.beam/credentials.json`.

## Design Context

```bash
beam inspect <figma-url>
beam inspect <figma-url> --json
beam export <figma-url>
beam compare <figma-url> <local-url>
```

`inspect` returns implementation context. `export` writes local assets. `compare` writes local visual comparison artifacts.

## Local Reuse

```bash
beam snapshots list
beam snapshots show <snapshot-id>
beam snapshots restore <snapshot-id>
```

Snapshot commands use local files and do not call Figma.

## Component Mappings

```bash
beam mappings add --figma-component-id 123:456 --figma-name "Button / Primary" --import "@/components/button" --export Button
beam mappings list
beam mappings remove 123:456
```

Mappings are project-local in `.beam/mappings.json` and contain no secrets.

## Agent Integration

```bash
beam init --print
beam mcp
```

Agents can use Beam MCP tools for design context, assets, variables, snapshots, mappings, and compare.

## Debugging

```bash
beam debug bundle
```

Debug bundles are local and redacted by default.
