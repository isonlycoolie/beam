import type { FigmaNode } from "../simplify/node-normalizer.js";
import { flattenNodes, normalizeNode } from "../simplify/node-normalizer.js";

export type AssetCandidate = {
  nodeId: string;
  name: string;
  type: "frame" | "raster" | "vector" | "icon" | "decorative";
  reason: string;
};

export function discoverAssets(document: FigmaNode): AssetCandidate[] {
  const nodes = flattenNodes(normalizeNode(document));
  const candidates: AssetCandidate[] = [];

  for (const node of nodes) {
    if (!node.id) {
      continue;
    }

    if (node.type === "FRAME" && node === nodes[0]) {
      candidates.push({
        nodeId: node.id,
        name: node.name,
        type: "frame",
        reason: "Frame export target",
      });
      continue;
    }

    if (
      (node.fills ?? []).some((fill) => fill.type === "IMAGE" || fill.imageRef)
    ) {
      candidates.push({
        nodeId: node.id,
        name: node.name,
        type: "raster",
        reason: "Raster image fill",
      });
      continue;
    }

    if (node.type === "VECTOR") {
      candidates.push({
        nodeId: node.id,
        name: node.name,
        type: /icon/i.test(node.name) ? "icon" : "vector",
        reason: /icon/i.test(node.name)
          ? "Icon-like vector node"
          : "Exportable vector node",
      });
      continue;
    }

    const box = node.absoluteBoundingBox;
    if (box?.width && box.height && box.width * box.height > 250_000) {
      candidates.push({
        nodeId: node.id,
        name: node.name,
        type: "decorative",
        reason: "Large decorative asset",
      });
    }
  }

  return candidates;
}
