import type { BriefSource } from "../clone/clone-brief.js";
import type { FigmaBundle } from "./types.js";

/** Brief wording and file list for a Figma export, including the file's design variables. */
export function figmaSource(bundle: FigmaBundle): BriefSource {
  const vars = bundle.variables.slice(0, 40).map((v) => `- \`${v.collection}/${v.name}\` (${v.mode}): \`${v.value}\``);
  return {
    intro: [
      `Every value below comes from the Figma frame "${bundle.source.frameName}" on page "${bundle.source.pageName}". Use these values exactly. If something you need is not here, look it up in \`frame.json\`; never invent it.`,
      "Where the design uses a variable, prefer the matching token in the codebase only when its value is identical.",
    ].join("\n\n"),
    files: [
      "- `frame.json`: the layer tree with boxes, fills, strokes, radii, shadows, auto layout and text styles",
      "- `spec.json`: the same layers as measured elements, the format `beam verify` checks against",
      "- `frame.png`, `frame@2x.png`: what it must look like",
      `- \`images/\` (${Object.keys(bundle.images).length}): image fills; \`svgs/\` (${Object.keys(bundle.svgs).length}): icons and vectors as SVG`,
      `- \`variables.json\` (${bundle.variables.length} values)${vars.length ? `:\n${vars.join("\n")}` : ""}`,
    ].join("\n"),
  };
}
