import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { Kit } from "./catalog.js";

/** .beam/kits.json records exactly what each install wrote, so remove and update never guess. */
export type InstalledKit = { name: string; version: string; skillDirs: string[]; components?: string };
export type KitsLock = { schemaVersion: "1.0"; kits: Record<string, InstalledKit> };

const lockPath = (cwd: string) => join(cwd, ".beam", "kits.json");

export async function readKitsLock(cwd: string): Promise<KitsLock> {
  try {
    return JSON.parse(await readFile(lockPath(cwd), "utf8")) as KitsLock;
  } catch {
    return { schemaVersion: "1.0", kits: {} };
  }
}

async function writeKitsLock(cwd: string, lock: KitsLock): Promise<void> {
  await mkdir(dirname(lockPath(cwd)), { recursive: true });
  await writeFile(lockPath(cwd), `${JSON.stringify(lock, null, 2)}\n`);
}

/** Skill files only: kit.json is Beam's metadata and components/ is copied into the app, not the skill. */
const isSkillFile = (kit: Kit) => (source: string) => {
  const rel = source.slice(kit.dir.length).replace(/\\/g, "/");
  return rel !== "/kit.json" && !(kit.components && rel.startsWith(`/${kit.components.from}`));
};

export async function installKit(input: {
  kit: Kit;
  cwd: string;
  targets: string[];
  force?: boolean;
}): Promise<InstalledKit> {
  const { kit, cwd } = input;
  const skillDirs: string[] = [];
  for (const target of input.targets) {
    const dest = join(target, `beam-${kit.name}`);
    await rm(join(cwd, dest), { recursive: true, force: true });
    await cp(kit.dir, join(cwd, dest), { recursive: true, filter: isSkillFile(kit) });
    skillDirs.push(dest.replace(/\\/g, "/"));
  }

  let components: string | undefined;
  if (kit.components) {
    components = kit.components.to;
    // Components become the user's code: keep their edits unless they ask to overwrite.
    await cp(join(kit.dir, kit.components.from), join(cwd, components), {
      recursive: true,
      force: input.force ?? false,
      errorOnExist: false,
    });
  }

  const record: InstalledKit = { name: kit.name, version: kit.version, skillDirs, components };
  const lock = await readKitsLock(cwd);
  lock.kits[kit.name] = record;
  await writeKitsLock(cwd, lock);
  return record;
}

/** Removes the skill folders a kit installed. Copied components stay, because they are the user's code now. */
export async function removeKit(cwd: string, name: string): Promise<InstalledKit | undefined> {
  const lock = await readKitsLock(cwd);
  const record = lock.kits[name];
  if (!record) return undefined;
  for (const dir of record.skillDirs) await rm(join(cwd, dir), { recursive: true, force: true });
  delete lock.kits[name];
  await writeKitsLock(cwd, lock);
  return record;
}
