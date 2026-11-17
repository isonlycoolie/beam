import { spawn } from "node:child_process";
import { heading, muted, success } from "../terminal.js";

export type Runner = (command: string, args: string[]) => Promise<number>;

const run: Runner = (command, args) =>
  new Promise((resolve, reject) => {
    // npx is a .cmd shim on Windows, which only starts through a shell.
    const child = spawn(command, args, { stdio: "inherit", shell: process.platform === "win32" });
    child.on("error", reject);
    child.on("exit", (code) => resolve(code ?? 1));
  });

export const DEFAULT_REGISTRY = "https://beam.dev/r";

/** Registry item URLs for `ui/button ui/stat-card`. */
export function uiItemUrls(names: string[], registry: string): string[] {
  const base = registry.replace(/\/$/, "");
  return names.map((name) => `${base}/${name.replace(/^ui\//, "")}.json`);
}

/**
 * Installs Beam UI components through the shadcn CLI, so they land where the project's components.json says
 * and stay compatible with shadcn projects.
 */
export async function uiAddCommand(names: string[], options: { registry?: string; runner?: Runner } = {}): Promise<void> {
  const registry = options.registry ?? process.env.BEAM_REGISTRY_URL ?? DEFAULT_REGISTRY;
  const urls = uiItemUrls(names, registry);
  process.stdout.write(`${heading("Beam UI")}\n${muted(`Installing ${names.join(", ")} with the shadcn CLI`)}\n`);
  const code = await (options.runner ?? run)("npx", ["shadcn@latest", "add", ...urls, "--yes"]);
  if (code !== 0)
    throw Object.assign(new Error("The shadcn CLI could not add the components."), {
      payload: {
        code: "BEAM_INTERNAL_ERROR",
        message: "The shadcn CLI could not add the components.",
        exitCode: code,
        fix: "Run npx shadcn@latest init in this project first, then try again.",
      },
    });
  process.stdout.write(`${success(`Added ${names.join(", ")}`)}\n`);
}
