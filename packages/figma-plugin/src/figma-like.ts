/* Minimal shapes of the Figma plugin API this file reads, so it can run in tests without Figma. */
export type RGB = { r: number; g: number; b: number };
export type Paint = { type: string; visible?: boolean; opacity?: number; color?: RGB; imageHash?: string | null; gradientStops?: Array<{ color: RGB & { a: number }; position: number }> };
export type Effect = { type: string; visible?: boolean; color?: RGB & { a: number }; offset?: { x: number; y: number }; radius: number; spread?: number };
export type Unit = { unit: "PIXELS" | "PERCENT" | "AUTO"; value?: number };
export type NodeLike = {
  id: string; name: string; type: string; visible?: boolean; opacity?: number;
  absoluteBoundingBox?: { x: number; y: number; width: number; height: number } | null;
  fills?: readonly Paint[] | symbol; strokes?: readonly Paint[]; strokeWeight?: number | symbol;
  cornerRadius?: number | symbol; topLeftRadius?: number; topRightRadius?: number; bottomRightRadius?: number; bottomLeftRadius?: number;
  effects?: readonly Effect[]; layoutMode?: "NONE" | "HORIZONTAL" | "VERTICAL";
  paddingTop?: number; paddingRight?: number; paddingBottom?: number; paddingLeft?: number; itemSpacing?: number;
  primaryAxisAlignItems?: string; counterAxisAlignItems?: string;
  characters?: string; fontName?: { family: string; style: string } | symbol; fontSize?: number | symbol; fontWeight?: number | symbol;
  lineHeight?: Unit | symbol; letterSpacing?: Unit | symbol; textAlignHorizontal?: string; textCase?: string | symbol;
  isAsset?: boolean; children?: readonly NodeLike[];
};
