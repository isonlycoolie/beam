export type FigmaPaint = {
  type?: string;
  color?: {
    r?: number;
    g?: number;
    b?: number;
    a?: number;
  };
  imageRef?: string;
};

export type FigmaNode = {
  id?: string;
  name?: string;
  type?: string;
  visible?: boolean;
  locked?: boolean;
  children?: FigmaNode[];
  absoluteBoundingBox?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  };
  layoutMode?: "HORIZONTAL" | "VERTICAL" | "NONE";
  itemSpacing?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  fills?: FigmaPaint[];
  strokes?: FigmaPaint[];
  effects?: unknown[];
  cornerRadius?: number;
  style?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: number;
  };
  characters?: string;
  componentId?: string;
};

export type NormalizedNode = FigmaNode & {
  id: string;
  name: string;
  type: string;
  children: NormalizedNode[];
};

export function normalizeNode(node: FigmaNode): NormalizedNode {
  return {
    ...node,
    id: node.id ?? "",
    name: node.name ?? "Unnamed",
    type: node.type ?? "UNKNOWN",
    children: (node.children ?? [])
      .filter((child) => child.visible !== false && child.locked !== true)
      .map(normalizeNode),
  };
}

export function flattenNodes(node: NormalizedNode): NormalizedNode[] {
  return [node, ...node.children.flatMap(flattenNodes)];
}
