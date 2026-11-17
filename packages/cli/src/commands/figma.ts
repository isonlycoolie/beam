import { join, relative } from "node:path";
import { importFigmaBundle } from "@beam/core";
import { heading, label, muted, path, success } from "../terminal.js";

/** Unpacks a .beam.json file from the Beam Figma plugin. No Figma token or API call is involved. */
export async function figmaImportCommand(file: string, options: { json?: boolean; cwd?: string } = {}): Promise<void> {
  const cwd = options.cwd ?? process.cwd();
  const { dir, spec, bundle } = await importFigmaBundle({ file, cwd });
  if (options.json) {
    process.stdout.write(`${JSON.stringify({ dir, reference: spec.url, brief: join(dir, "brief.md") }, null, 2)}\n`);
    return;
  }
  const frame = spec.breakpoints[0]!;
  const lines = [
    heading("Beam figma import"),
    "",
    success(`Imported ${bundle.source.frameName}`),
    label("Frame", `${frame.width}x${frame.height}, ${frame.sections.length} sections, ${frame.elements.length} layers`),
    label("Files", `${Object.keys(bundle.images).length} images, ${Object.keys(bundle.svgs).length} SVGs, ${bundle.variables.length} variable values`),
    label("Brief", path(relative(cwd, join(dir, "brief.md")))),
    "",
    muted(`Check your build against the design: beam verify --reference ${spec.url} --target <your local url>`),
  ];
  process.stdout.write(`${lines.join("\n")}\n`);
}
