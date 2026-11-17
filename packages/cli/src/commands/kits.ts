import { access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  checkBrowser,
  detectAgents,
  installKit,
  listKits,
  loadKit,
  readKitsLock,
  removeKit,
  skillTargets,
  type AgentId,
} from "@beam/core";
import { heading, label, muted, success, warning } from "../terminal.js";
import { uiAddCommand } from "./ui-add.js";

export type KitOptions = { cwd?: string; kitsDir?: string; agent?: AgentId[]; force?: boolean; json?: boolean };

/** The published CLI ships kits in dist/kits; from source they live in packages/kits. */
export async function defaultKitsDir(): Promise<string> {
  for (const rel of ["./kits", "../../kits"]) {
    const dir = fileURLToPath(new URL(rel, import.meta.url));
    if (await access(dir).then(() => true, () => false)) return dir;
  }
  return fileURLToPath(new URL("./kits", import.meta.url));
}

const out = (text: string): void => {
  process.stdout.write(`${text}\n`);
};
const fail = (message: string, fix: string, exitCode = 2) =>
  Object.assign(new Error(message), { payload: { code: "BEAM_INVALID_INPUT", message, fix, exitCode } });

export async function addCommand(names: string[], options: KitOptions = {}): Promise<void> {
  // ui/<component> installs Beam UI components; everything else is a tool kit.
  const components = names.filter((name) => name.startsWith("ui/"));
  if (components.length) await uiAddCommand(components);
  names = names.filter((name) => !name.startsWith("ui/"));
  if (names.length === 0) return;
  const cwd = options.cwd ?? process.cwd();
  const kitsDir = options.kitsDir ?? (await defaultKitsDir());
  const agents = options.agent?.length ? options.agent : await detectAgents(cwd);
  const targets = skillTargets(agents);
  const lines = [heading("Beam add"), ""];
  for (const name of names) {
    const kit = await loadKit(kitsDir, name);
    if (!kit) throw fail(`There is no Beam tool called "${name}".`, "Run beam list to see every tool.");
    const record = await installKit({ kit, cwd, targets, force: options.force });
    lines.push(success(`${kit.title} added`), ...record.skillDirs.map((dir) => label("Skill", dir)));
    if (record.components) lines.push(label("Components", record.components));
    for (const need of kit.requires) {
      if (need === "browser" && (await checkBrowser()).status === "pass") continue;
      lines.push(muted(need === "browser" ? "Needs Chromium: run beam setup browser once." : "Needs a Figma token: run beam login."));
    }
    lines.push("");
  }
  lines.push(muted(agents.length ? `Agents: ${agents.join(", ")}` : "No agent found, so skills went to .claude/skills and .agents/skills."));
  out(lines.join("\n"));
}

export async function listCommand(options: KitOptions = {}): Promise<void> {
  const kits = await listKits(options.kitsDir ?? (await defaultKitsDir()));
  const installed = (await readKitsLock(options.cwd ?? process.cwd())).kits;
  if (options.json) return out(JSON.stringify({ kits, installed }, null, 2));
  const lines = [heading("Beam tools"), ""];
  for (const kit of kits) {
    const mark = installed[kit.name] ? success("installed") : muted("not installed");
    const status = kit.status === "stable" ? "" : ` ${warning(kit.status)}`;
    lines.push(`${kit.name.padEnd(8)} ${kit.summary}${status}  ${mark}`);
  }
  lines.push("", muted("Add one with beam add <tool>."));
  out(lines.join("\n"));
}

export async function removeCommand(name: string, options: KitOptions = {}): Promise<void> {
  const record = await removeKit(options.cwd ?? process.cwd(), name);
  if (!record) throw fail(`${name} is not installed here.`, "Run beam list to see what is installed.");
  const kept = record.components ? `\n${muted(`Kept your components in ${record.components}.`)}` : "";
  out(`${success(`Removed ${name}`)}${kept}`);
}

/** Re-installs every recorded kit from the current Beam version, into the same agent folders. */
export async function updateCommand(options: KitOptions = {}): Promise<void> {
  const cwd = options.cwd ?? process.cwd();
  const kitsDir = options.kitsDir ?? (await defaultKitsDir());
  const records = Object.values((await readKitsLock(cwd)).kits);
  if (records.length === 0) return out(muted("No Beam tools installed yet. Run beam add <tool>."));
  for (const record of records) {
    const kit = await loadKit(kitsDir, record.name);
    if (!kit) continue;
    const targets = record.skillDirs.map((dir) => dir.replace(/\/beam-[^/]+$/, ""));
    await installKit({ kit, cwd, targets });
    out(`${success(`Updated ${kit.name}`)} ${muted(`${record.version} -> ${kit.version}`)}`);
  }
}
