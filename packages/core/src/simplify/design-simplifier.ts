import type { BeamWarning, ImplementationBrief } from "../contracts/index.js";
import { extractComponents, validateNodes } from "./design-analysis.js";
import { extractStyles } from "./style-extractor.js";
import { inferLayout } from "./layout-inference.js";
import {
  flattenNodes,
  normalizeNode,
  type FigmaNode,
  type NormalizedNode,
} from "./node-normalizer.js";

export type SimplifyDesignResult = {
  brief: ImplementationBrief;
  warnings: BeamWarning[];
};

export function simplifyDesign(input: {
  document: FigmaNode;
}): SimplifyDesignResult {
  const root = normalizeNode(input.document);
  const nodes = flattenNodes(root);
  const warnings = validateNodes(nodes);
  const { layout, warnings: layoutWarnings } = inferLayout(root, nodes);
  const styles = extractStyles(nodes);
  const components = extractComponents(nodes.slice(1));

  warnings.push(...layoutWarnings);

  const brief: ImplementationBrief = {
    frame: {
      id: root.id,
      name: root.name,
      width: root.absoluteBoundingBox?.width,
      height: root.absoluteBoundingBox?.height,
      background: styles.colors[0],
      nodeCount: nodes.length,
    },
    layout,
    components,
    tokens: styles,
    assets: [],
    implementationNotes: implementationNotes(root, layout.sections),
  };

  return { brief, warnings };
}

function implementationNotes(
  root: NormalizedNode,
  sections: string[],
): string[] {
  const notes: string[] = [];

  if (root.layoutMode === "HORIZONTAL" || root.layoutMode === "VERTICAL") {
    notes.push(`Frame uses ${root.layoutMode.toLowerCase()} auto layout.`);
  }

  if (sections.length > 0) {
    notes.push(`Primary sections: ${sections.join(", ")}.`);
  }

  return notes;
}
