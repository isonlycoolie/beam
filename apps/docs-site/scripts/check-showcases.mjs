// Every rebuilt reference must say what it was rebuilt from and be listed, so nothing on the Palettes pages is
// invented UI (docs/beam-ui/00-rules.md). Runs before dev and build.
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const dir = fileURLToPath(new URL("../components/showcase/", import.meta.url));
const registry = readFileSync(`${dir}registry.ts`, "utf8");
const problems = [];
// Helpers that show rebuilds; every other file here is a rebuild.
const HELPERS = new Set(["palette-showcase.tsx", "fit-scale.tsx"]);
const files = readdirSync(dir).filter((f) => f.endsWith(".tsx") && !HELPERS.has(f));
for (const file of files) {
  const source = readFileSync(`${dir}${file}`, "utf8");
  if (!/Design reference: \w+/.test(source)) problems.push(`${file}: no "Design reference:" line`);
  if (!/Rebuilt from measured values \(Pictures\/beam\/references\/[\w/-]+\.json\)/.test(source)) problems.push(`${file}: no measured-values source`);
  if (!registry.includes(`"./${file.replace(/\.tsx$/, "")}"`)) problems.push(`${file}: not in registry.ts`);
}
if (problems.length) throw new Error(`Showcase rules:\n${problems.join("\n")}`);
console.log(`showcases: ${files.length} checked`);
