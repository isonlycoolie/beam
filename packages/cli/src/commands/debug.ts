import { createDebugBundle } from "@beam/core";
import { heading, label, path, success } from "../terminal.js";

export async function debugCommand(
  action: string,
  options: { out?: string; includeRaw?: boolean; json?: boolean; cwd?: string },
): Promise<void> {
  if (action !== "bundle") {
    throw new Error(`Unsupported debug action: ${action}`);
  }

  const result = await createDebugBundle({
    cwd: options.cwd ?? process.cwd(),
    outDir: options.out,
    includeRaw: options.includeRaw,
  });

  if (options.json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }

  process.stdout.write(
    `${heading("Beam debug bundle")}\n\n${success("Bundle written")}\n${label("Path", path(result.path))}\n`,
  );
}
