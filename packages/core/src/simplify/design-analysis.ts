import type { BeamWarning } from "../contracts/index.js";
import type { NormalizedNode } from "./node-normalizer.js";

export function validateNodes(nodes: NormalizedNode[]): BeamWarning[] {
  const warnings: BeamWarning[] = [];

  for (const node of nodes) {
    if (!node.id) {
      warnings.push({
        code: "MISSING_NODE_ID",
        severity: "high",
        message: "A Figma node is missing an id.",
      });
    }

    if (node.type === "TEXT" && !node.style?.fontFamily) {
      warnings.push({
        code: "MISSING_FONT_METADATA",
        severity: "low",
        message: "A text node is missing font metadata.",
        nodeId: node.id,
      });
    }
  }

  return warnings;
}

export function extractComponents(
  nodes: NormalizedNode[],
): Array<Record<string, unknown>> {
  return nodes
    .filter((node) => node.componentId || isComponentCandidate(node))
    .map((node) => ({
      nodeId: node.id,
      name: node.name,
      type: node.type.toLowerCase(),
      ...(node.componentId ? { componentId: node.componentId } : {}),
      reuseHint: node.componentId
        ? "Figma component instance"
        : "Component candidate",
    }));
}

function isComponentCandidate(node: NormalizedNode): boolean {
  return (
    node.type === "FRAME" && /card|button|nav|form|list|item/i.test(node.name)
  );
}
