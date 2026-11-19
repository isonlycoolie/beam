// Writes packages/kits/craft/references/screens.md: the screens agents start from instead of laying out a page from
// scratch. Generated from packages/ui/registry/screens/*/spec.json; run after adding or changing a screen.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const screensDir = fileURLToPath(new URL("../registry/screens", import.meta.url));
const out = fileURLToPath(new URL("../../kits/craft/references/screens.md", import.meta.url));
const GROUPS = ["Dashboard", "Agent", "Sidebar", "Login", "Sign up"];

const screens = readdirSync(screensDir)
  .sort()
  .map((id) => {
    const spec = JSON.parse(readFileSync(join(screensDir, id, "spec.json"), "utf8"));
    const components = new Set();
    for (const f of spec.files.filter((f) => f.endsWith(".tsx"))) {
      for (const m of readFileSync(join(screensDir, id, f), "utf8").matchAll(/from "@beam\/ui\/components\/([a-z-]+)"/g)) components.add(m[1]);
    }
    return { ...spec, components: [...components].sort() };
  });

const lines = [
  "# Screens",
  "",
  "Finished screens built from Beam UI components. When the task is a dashboard, an agent or chat workspace, an app shell with a sidebar, a login or a sign-up page, start from the closest screen here: install it, then change its data and copy. Do not lay the page out from scratch.",
  "",
  "- Install: `npx usebeam add screens/<id>` writes `app/<id>/page.tsx` and its parts in `components/`.",
  "- Sidebar layouts also install as components: `npx usebeam add ui/<id>`.",
  "- Read the full source first with the MCP tool `screens_get` (or list them with `screens_list`).",
  "- Sample data sits at the top of each file or in `data.json`; replace it, keep the fields.",
  "",
];
for (const g of GROUPS) {
  lines.push(`## ${g}`, "", "| id | Use it for | Built from |", "| --- | --- | --- |");
  for (const s of screens.filter((s) => s.group === g)) lines.push(`| \`${s.id}\` | ${s.summary} | ${s.components.join(", ")} |`);
  lines.push("");
}
writeFileSync(out, lines.join("\n"));
console.log(`screens reference: ${screens.length} screens -> ${out}`);
