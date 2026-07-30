import { rm } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const nextDir = resolve(appRoot, ".next");

if (!nextDir.startsWith(`${appRoot}${sep}`)) {
  throw new Error(`Refusing to remove path outside app: ${nextDir}`);
}

await rm(nextDir, { recursive: true, force: true });
