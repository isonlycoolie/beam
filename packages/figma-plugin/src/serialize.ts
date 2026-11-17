import type { BundleNode, BundleText } from "../../core/src/figma-bundle/types.js";
import type { NodeLike, Paint, RGB, Unit } from "./figma-like.js";

export type { NodeLike } from "./figma-like.js";

const channel = (n: number) => Math.round(n * 255);
export const rgb = (c: RGB, alpha = 1) =>
  alpha >= 1 ? `rgb(${channel(c.r)}, ${channel(c.g)}, ${channel(c.b)})` : `rgba(${channel(c.r)}, ${channel(c.g)}, ${channel(c.b)}, ${Number(alpha.toFixed(3))})`;
const px = (n: number) => `${Number(n.toFixed(3))}px`;
const visible = <T extends { visible?: boolean }>(items: readonly T[] | symbol | undefined): T[] =>
  Array.isArray(items) ? items.filter((i) => i.visible !== false) : [];

export function paintToCss(paint: Paint): string | undefined {
  const alpha = paint.opacity ?? 1;
  if (paint.type === "SOLID" && paint.color) return rgb(paint.color, alpha);
  if (paint.type === "IMAGE" && paint.imageHash) return `image:${paint.imageHash}`;
  if (paint.type === "GRADIENT_LINEAR" && paint.gradientStops)
    return `linear-gradient(${paint.gradientStops.map((s) => `${rgb(s.color, s.color.a * alpha)} ${Math.round(s.position * 100)}%`).join(", ")})`;
  return undefined;
}

export function unitToCss(value: Unit | symbol | undefined, fontSize: number): string {
  if (!value || typeof value === "symbol" || value.unit === "AUTO" || value.value === undefined) return "normal";
  return px(value.unit === "PERCENT" ? (value.value / 100) * fontSize : value.value);
}

function textOf(node: NodeLike): BundleText | undefined {
  if (node.type !== "TEXT" || node.characters === undefined) return undefined;
  const size = typeof node.fontSize === "number" ? node.fontSize : 16;
  const font = typeof node.fontName === "object" ? node.fontName : { family: "", style: "" };
  const fill = visible(node.fills as readonly Paint[])[0];
  const align = (node.textAlignHorizontal ?? "LEFT").toLowerCase();
  const textCase = { UPPER: "uppercase", LOWER: "lowercase", TITLE: "capitalize" }[String(node.textCase)] ?? "none";
  return {
    characters: node.characters,
    fontFamily: font.family,
    fontStyle: font.style,
    fontWeight: typeof node.fontWeight === "number" ? node.fontWeight : 400,
    fontSize: size,
    lineHeight: unitToCss(node.lineHeight, size),
    letterSpacing: unitToCss(node.letterSpacing, size),
    align: (align === "justified" ? "justify" : align) as BundleText["align"],
    textCase: textCase as BundleText["textCase"],
    color: fill?.color ? rgb(fill.color, fill.opacity ?? 1) : "rgb(0, 0, 0)",
  };
}

function radiusOf(n: NodeLike): string | undefined {
  if (typeof n.cornerRadius === "number") return n.cornerRadius ? px(n.cornerRadius) : undefined;
  const corners = [n.topLeftRadius, n.topRightRadius, n.bottomRightRadius, n.bottomLeftRadius];
  return corners.some((c) => c) ? corners.map((c) => px(c ?? 0)).join(" ") : undefined;
}

/** Turns a Figma node tree into Beam's bundle tree with CSS-ready values, positioned relative to `origin`. */
export function serializeNode(node: NodeLike, origin: { x: number; y: number }): BundleNode {
  const b = node.absoluteBoundingBox ?? { x: origin.x, y: origin.y, width: 0, height: 0 };
  const shadows = visible(node.effects).filter((e) => e.type === "DROP_SHADOW" && e.color);
  const stroke = visible(node.strokes)[0];
  const layout = node.layoutMode && node.layoutMode !== "NONE";
  return {
    id: node.id,
    name: node.name,
    type: node.type,
    box: { x: b.x - origin.x, y: b.y - origin.y, width: b.width, height: b.height },
    opacity: node.opacity ?? 1,
    fills: node.type === "TEXT" ? [] : visible(node.fills as readonly Paint[]).map(paintToCss).filter((f): f is string => Boolean(f)),
    stroke: stroke?.color && typeof node.strokeWeight === "number" ? { color: rgb(stroke.color, stroke.opacity ?? 1), width: node.strokeWeight } : undefined,
    radius: radiusOf(node),
    shadow: shadows.length ? shadows.map((e) => `${px(e.offset?.x ?? 0)} ${px(e.offset?.y ?? 0)} ${px(e.radius)} ${px(e.spread ?? 0)} ${rgb(e.color!, e.color!.a)}`).join(", ") : undefined,
    layout: layout
      ? { mode: node.layoutMode === "HORIZONTAL" ? "row" : "column", padding: [node.paddingTop ?? 0, node.paddingRight ?? 0, node.paddingBottom ?? 0, node.paddingLeft ?? 0], gap: node.itemSpacing ?? 0, justify: String(node.primaryAxisAlignItems ?? "MIN").toLowerCase(), align: String(node.counterAxisAlignItems ?? "MIN").toLowerCase() }
      : undefined,
    text: textOf(node),
    children: (node.children ?? []).filter((c) => c.visible !== false).map((c) => serializeNode(c, origin)),
  };
}
