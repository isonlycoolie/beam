// Writes palettes/<id>.css and palettes/palettes.json from palettes.ts. Run: node packages/ui/palettes/build.ts
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildPalettes } from "./palettes.ts";

const dir = import.meta.dirname;
const palettes = buildPalettes();
for (const p of palettes) writeFileSync(join(dir, `${p.id}.css`), p.css);
writeFileSync(join(dir, "palettes.json"), `${JSON.stringify(palettes.map(({ css, ...rest }) => rest), null, 2)}\n`);
console.log(`palettes: ${palettes.length}`);
