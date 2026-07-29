import { build } from "esbuild";
import { chmod, mkdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDir, "..");
const cliDir = join(root, "packages", "cli");
const distDir = join(cliDir, "dist");
const shared = {
  bundle: true,
  platform: "node",
  target: "node22",
  format: "esm",
  sourcemap: false,
  packages: "bundle",
  external: ["pixelmatch", "playwright", "pngjs"],
  logLevel: "silent",
};

await mkdir(distDir, { recursive: true });

await build({
  ...shared,
  entryPoints: [join(cliDir, "src", "cli.ts")],
  outfile: join(distDir, "cli.js"),
});

await build({
  ...shared,
  entryPoints: [join(cliDir, "src", "index.ts")],
  outfile: join(distDir, "index.js"),
});

await chmod(join(distDir, "cli.js"), 0o755);
