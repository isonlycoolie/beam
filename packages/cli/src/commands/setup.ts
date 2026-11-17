import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { heading, muted, success } from "../terminal.js";

type Runner = (command: string, args: string[]) => Promise<number>;

const runProcess: Runner = (command, args) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => resolve(code ?? 1));
  });

/** Path to Playwright's own CLI, which knows how to download its matching browser build. */
export function playwrightCliPath(): string {
  const require = createRequire(import.meta.url);
  return join(dirname(require.resolve("playwright/package.json")), "cli.js");
}

export async function setupCommand(
  target: string,
  options: { run?: Runner } = {},
): Promise<void> {
  if (target !== "browser") {
    throw Object.assign(new Error(`Unknown setup target "${target}".`), {
      payload: {
        code: "BEAM_INVALID_INPUT",
        message: `Unknown setup target "${target}".`,
        exitCode: 2,
        fix: "Run beam setup browser.",
      },
    });
  }

  process.stdout.write(`${heading("Beam setup")}\n${muted("Downloading Chromium for screenshots (about 150 MB, once).")}\n`);
  const run = options.run ?? runProcess;
  const exitCode = await run(process.execPath, [playwrightCliPath(), "install", "chromium"]);
  if (exitCode !== 0) {
    throw Object.assign(new Error("Chromium download failed."), {
      payload: {
        code: "BEAM_INTERNAL_ERROR",
        message: "Chromium download failed.",
        exitCode,
        fix: "Check your connection and run beam setup browser again.",
      },
    });
  }
  process.stdout.write(`${success("Chromium is ready.")} ${muted("Run beam doctor to confirm.")}\n`);
}
