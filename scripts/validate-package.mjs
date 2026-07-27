import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const cliPackagePath = join(root, "packages", "cli", "package.json");
const cliEntryPath = join(root, "packages", "cli", "dist", "cli.js");
const cliIndexPath = join(root, "packages", "cli", "dist", "index.js");
const readmePath = join(root, "README.md");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

const cliPackage = readJson(cliPackagePath);

assert(
  cliPackage.bin?.beam === "./dist/cli.js",
  "beam bin must point to dist/cli.js",
);
assert(
  cliPackage.exports?.["."] === "./dist/index.js",
  "package export must point to dist/index.js",
);
assert(existsSync(cliEntryPath), "built CLI entry is missing");
assert(existsSync(cliIndexPath), "built package export is missing");

const cliEntry = readFileSync(cliEntryPath, "utf8");
assert(
  cliEntry.startsWith("#!/usr/bin/env node"),
  "built CLI shebang is missing",
);

const readme = readFileSync(readmePath, "utf8");
for (const command of [
  "beam login --token <figma-token>",
  "beam doctor",
  "beam inspect <figma-url>",
  "beam export <figma-url>",
  "beam snapshots list",
  "beam mappings list",
  "beam debug bundle",
  "beam mcp",
]) {
  assert(readme.includes(command), `README is missing ${command}`);
}

const help = execFileSync(process.execPath, [cliEntryPath, "--help"], {
  encoding: "utf8",
});
assert(help.includes("inspect"), "CLI help is missing inspect");
assert(help.includes("compare"), "CLI help is missing compare");
assert(help.includes("mappings"), "CLI help is missing mappings");
assert(help.includes("debug"), "CLI help is missing debug");

for (const path of [
  "docs/free-user-guide.md",
  "examples/basic-inspect/README.md",
  "examples/mcp-config/README.md",
  "examples/local-mapping/README.md",
]) {
  assert(existsSync(join(root, path)), `${path} is missing`);
}

const trackedText = [
  readme,
  readFileSync(join(root, "docs", "free-user-guide.md"), "utf8"),
  readFileSync(join(root, "examples", "basic-inspect", "README.md"), "utf8"),
  readFileSync(join(root, "examples", "local-mapping", "README.md"), "utf8"),
].join("\n");
assert(!trackedText.includes("figd_secret"), "tracked docs contain a token");
assert(
  !trackedText.includes("token=secret"),
  "tracked docs contain a signed URL",
);

const initPrint = execFileSync(
  process.execPath,
  [cliEntryPath, "init", "--print"],
  {
    encoding: "utf8",
  },
);
assert(
  initPrint.includes('"command": "beam"'),
  "init --print must include beam command",
);
assert(initPrint.includes('"mcp"'), "init --print must include mcp arg");
