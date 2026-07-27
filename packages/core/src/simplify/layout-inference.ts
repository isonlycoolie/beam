import type { BeamWarning } from "../contracts/index.js";
import type { NormalizedNode } from "./node-normalizer.js";

export type LayoutSummary = {
  direction?: "horizontal" | "vertical";
  spacing?: number;
  padding: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  sections: string[];
  repeatedGroups: Array<{
    name: string;
    count: number;
  }>;
};

export function inferLayout(
  root: NormalizedNode,
  nodes: NormalizedNode[],
): { layout: LayoutSummary; warnings: BeamWarning[] } {
  const warnings: BeamWarning[] = [];
  const absoluteChildren = root.children.filter(
    (child) => child.absoluteBoundingBox && !root.layoutMode,
  );

  if (absoluteChildren.length > 0) {
    warnings.push({
      code: "ABSOLUTE_LAYOUT_DETECTED",
      severity: "medium",
      message:
        "Some child nodes use absolute positioning and may not represent responsive layout.",
      nodeId: root.id,
    });
  }

  const repeatedGroups = countByName(nodes)
    .filter(
      (group): group is { name: string; count: number } =>
        Boolean(group.name) && group.count > 1,
    )
    .map(({ name, count }) => ({ name, count }));

  return {
    layout: {
      direction:
        root.layoutMode === "HORIZONTAL"
          ? "horizontal"
          : root.layoutMode === "VERTICAL"
            ? "vertical"
            : undefined,
      spacing: root.itemSpacing,
      padding: {
        top: root.paddingTop,
        right: root.paddingRight,
        bottom: root.paddingBottom,
        left: root.paddingLeft,
      },
      sections: root.children.map((child) => child.name ?? "Unnamed"),
      repeatedGroups,
    },
    warnings,
  };
}

function countByName(
  nodes: NormalizedNode[],
): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>();

  for (const node of nodes) {
    counts.set(node.name, (counts.get(node.name) ?? 0) + 1);
  }

  return [...counts.entries()].map(([name, count]) => ({ name, count }));
}
