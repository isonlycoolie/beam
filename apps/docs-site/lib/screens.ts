import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export const SCREENS_DIR = join(process.cwd(), "..", "..", "packages", "ui", "registry", "screens");

export type ScreenSpec = { id: string; group: string; title: string; summary: string; source: string; files: string[] };

export const readScreen = (id: string): ScreenSpec => JSON.parse(readFileSync(join(SCREENS_DIR, id, "spec.json"), "utf8"));
export const allScreens = (): ScreenSpec[] => readdirSync(SCREENS_DIR).sort().map(readScreen);

/** A screen file as it reads once installed: shadcn's app paths, not the monorepo's. */
export function screenSource(id: string, file: string): string {
  return readFileSync(join(SCREENS_DIR, id, file), "utf8")
    .trim()
    .replaceAll(/from "@beam\/ui\/components\/([a-z-]+)"/g, 'from "@/components/ui/$1"')
    .replaceAll('from "@beam/ui/lib/cn"', 'from "@/lib/beam"')
    .replaceAll('from "@beam/ui/lib/use-mobile"', 'from "@/hooks/use-mobile"')
    .replaceAll(/from "\.\/components\/([a-z-]+)"/g, 'from "@/components/$1"');
}
