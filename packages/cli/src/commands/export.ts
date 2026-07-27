import { exportDesignAssets } from "@beam/core";
import { heading, label, path, success } from "../terminal.js";

export async function exportCommand(
  url: string,
  options: { out?: string; scale?: string; refresh?: boolean; json?: boolean },
): Promise<void> {
  const scale = parseScale(options.scale);
  const manifest = await exportDesignAssets({
    url,
    cwd: process.cwd(),
    outDir: options.out,
    scale,
    refresh: options.refresh,
  });

  if (options.json) {
    process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
    return;
  }

  process.stdout.write(
    `${heading("Beam export")}\n\n${success("Assets exported")}\n${label("Assets", manifest.assets.length)}\n${label("Manifest", path(manifest.manifestPath))}\n`,
  );
}

function parseScale(value: string | undefined): 1 | 2 | 3 | 4 {
  if (value === undefined) {
    return 2;
  }

  if (value === "1" || value === "2" || value === "3" || value === "4") {
    return Number(value) as 1 | 2 | 3 | 4;
  }

  throw new Error("Scale must be 1, 2, 3, or 4.");
}
