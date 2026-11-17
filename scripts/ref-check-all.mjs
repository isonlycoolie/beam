// Runs ref-compare for every registered rebuild whose reference capture exists, and prints one table.
// The gate before each commit (docs/beam-ui/00-rules.md).   node scripts/ref-check-all.mjs [base-url]
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const base = process.argv[2] ?? "http://localhost:3100";
const root = process.env.BEAM_REFERENCES ?? join(homedir(), "Pictures", "beam", "references");
// Every rebuild: harness id -> reference capture (<site>/<path>/<name>).
const list = JSON.parse(readFileSync(new URL("../apps/docs-site/components/ref-list.json", import.meta.url), "utf8"));
const rows = [];
for (const [id, ref] of Object.entries(list)) {
  const dir = join(root, ref.slice(0, ref.lastIndexOf("/")));
  const name = ref.slice(ref.lastIndexOf("/") + 1);
  if (!existsSync(join(dir, `${name}.json`))) {
    rows.push([id, "no capture"]);
    continue;
  }
  try {
    const out = execFileSync("node", [new URL("./ref-compare.mjs", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"), dir, name, `${base}/ref/${id}`], { encoding: "utf8" });
    rows.push([id, out.split("\n")[0].replace(`${name}: `, "")]);
  } catch (error) {
    rows.push([id, `FAIL ${String(error.stdout ?? error.message).split("\n").slice(0, 4).join(" | ")}`]);
  }
}
for (const [id, result] of rows) console.log(`${id.padEnd(28)} ${result}`);
process.exit(rows.some(([, r]) => r.startsWith("FAIL")) ? 1 : 0);
