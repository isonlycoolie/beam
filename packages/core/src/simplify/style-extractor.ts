import type { NormalizedNode } from "./node-normalizer.js";

export type ExtractedStyles = {
  colors: string[];
  typography: Array<{
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: number;
  }>;
  radii: number[];
  text: string[];
};

export function extractStyles(nodes: NormalizedNode[]): ExtractedStyles {
  const colors = new Set<string>();
  const typography = new Map<string, ExtractedStyles["typography"][number]>();
  const radii = new Set<number>();
  const text: string[] = [];

  for (const node of nodes) {
    for (const paint of [...(node.fills ?? []), ...(node.strokes ?? [])]) {
      if (paint.type === "SOLID" && paint.color) {
        colors.add(
          toHex(paint.color.r ?? 0, paint.color.g ?? 0, paint.color.b ?? 0),
        );
      }
    }

    if (typeof node.cornerRadius === "number") {
      radii.add(node.cornerRadius);
    }

    if (node.type === "TEXT" && node.characters) {
      text.push(node.characters);
      const token = {
        fontFamily: node.style?.fontFamily,
        fontSize: node.style?.fontSize,
        fontWeight: node.style?.fontWeight,
      };
      typography.set(JSON.stringify(token), token);
    }
  }

  return {
    colors: [...colors],
    typography: [...typography.values()],
    radii: [...radii],
    text,
  };
}

function toHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((channel) =>
      Math.round(Math.max(0, Math.min(1, channel)) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}
