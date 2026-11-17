import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import type { RecordedAsset } from "../clone/asset-recorder.js";
import { renderCloneBrief } from "../clone/clone-brief.js";
import { figmaSource } from "./figma-brief.js";
import type { CloneSpec } from "../clone/clone-service.js";
import { extractTokens } from "../clone/tokens.js";
import { bundleSections, bundleToElements } from "./to-elements.js";
import type { BundleNode, FigmaBundle } from "./types.js";

export type ImportedDesign = { dir: string; spec: CloneSpec; bundle: FigmaBundle };

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "frame";

function strip(node: BundleNode): BundleNode {
  return { ...node, children: node.children.map(strip) };
}

/**
 * Unpacks a Beam Figma plugin export into .beam/figma/<frame>/: renders, images, SVGs, variables,
 * measured elements and a brief, the same layout as a clone so the same skills and verify apply.
 */
export async function importFigmaBundle(input: { file: string; cwd: string }): Promise<ImportedDesign> {
  const bundle = JSON.parse(await readFile(resolve(input.cwd, input.file), "utf8")) as FigmaBundle;
  if (bundle?.schemaVersion !== "1.0" || !bundle.frame || !bundle.renders)
    throw Object.assign(new Error("This is not a Beam Figma export."), {
      payload: { code: "BEAM_INVALID_INPUT", message: "This is not a Beam Figma export.", exitCode: 2, fix: "Export the frame with the Beam Figma plugin, then import the .beam.json file." },
    });

  const dir = resolve(input.cwd, ".beam", "figma", slug(bundle.source.frameName));
  await rm(dir, { recursive: true, force: true });
  await mkdir(join(dir, "images"), { recursive: true });
  await mkdir(join(dir, "svgs"), { recursive: true });
  await writeFile(join(dir, "frame.png"), Buffer.from(bundle.renders["1x"], "base64"));
  await writeFile(join(dir, "frame@2x.png"), Buffer.from(bundle.renders["2x"], "base64"));

  const assets: RecordedAsset[] = [];
  for (const [hash, data] of Object.entries(bundle.images)) {
    const bytes = Buffer.from(data, "base64");
    await writeFile(join(dir, "images", `${hash}.png`), bytes);
    assets.push({ url: `figma-image:${hash}`, kind: "image", file: `images/${hash}.png`, bytes: bytes.length });
  }
  for (const [id, svg] of Object.entries(bundle.svgs)) {
    const file = `svgs/${id.replace(/[^a-zA-Z0-9]+/g, "-")}.svg`;
    await writeFile(join(dir, file), svg);
    assets.push({ url: `figma-node:${id}`, kind: "image", file, bytes: Buffer.byteLength(svg) });
  }

  const elements = bundleToElements(bundle.frame);
  const { width, height } = bundle.frame.box;
  const spec: CloneSpec = {
    schemaVersion: "1.0",
    url: `figma:${relative(input.cwd, dir).replace(/\\/g, "/")}`,
    capturedAt: bundle.exportedAt,
    title: `${bundle.source.frameName} (${bundle.source.fileName})`,
    breakpoints: [{ url: bundle.source.nodeId, width, height, elements, sections: bundleSections(bundle.frame), screenshot: "frame.png" }],
    tokens: extractTokens(elements),
    assets,
  };
  await writeFile(join(dir, "frame.json"), `${JSON.stringify(strip(bundle.frame), null, 2)}\n`);
  await writeFile(join(dir, "variables.json"), `${JSON.stringify(bundle.variables, null, 2)}\n`);
  await writeFile(join(dir, "spec.json"), `${JSON.stringify(spec, null, 2)}\n`);
  await writeFile(join(dir, "brief.md"), renderCloneBrief(spec, figmaSource(bundle)));
  return { dir, spec, bundle };
}
