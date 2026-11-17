import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";

/** kit.json: what a tool is, what it needs, and which files it copies into a project. */
export const kitManifestSchema = z.object({
  name: z.string().regex(/^[a-z][a-z0-9-]*$/),
  title: z.string(),
  summary: z.string(),
  version: z.string(),
  status: z.enum(["stable", "preview", "draft"]).default("stable"),
  requires: z.array(z.enum(["browser", "figma-token"])).default([]),
  /** Folders copied into the user's project, relative to the kit (for example Glass components). */
  components: z.object({ from: z.string(), to: z.string() }).optional(),
});

export type KitManifest = z.infer<typeof kitManifestSchema>;
export type Kit = KitManifest & { dir: string };

export async function loadKit(kitsDir: string, name: string): Promise<Kit | undefined> {
  const dir = join(kitsDir, name);
  try {
    const raw = JSON.parse(await readFile(join(dir, "kit.json"), "utf8"));
    return { ...kitManifestSchema.parse(raw), dir };
  } catch {
    return undefined;
  }
}

export async function listKits(kitsDir: string): Promise<Kit[]> {
  const entries = await readdir(kitsDir, { withFileTypes: true }).catch(() => []);
  const kits = await Promise.all(
    entries.filter((entry) => entry.isDirectory()).map((entry) => loadKit(kitsDir, entry.name)),
  );
  return kits.filter((kit): kit is Kit => kit !== undefined).sort((a, b) => a.name.localeCompare(b.name));
}
