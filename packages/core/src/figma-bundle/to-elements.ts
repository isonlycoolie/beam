import { ANY_TAG, type CapturedElement, type CapturedSection, type StyleKey } from "../verify/types.js";
import type { BundleNode } from "./types.js";

const px = (n: number) => `${Number(n.toFixed(3))}px`;

function styleOf(node: BundleNode): Record<StyleKey, string> {
  const t = node.text;
  const solid = node.fills.find((f) => f.startsWith("rgb"));
  const gradient = node.fills.find((f) => f.includes("gradient"));
  const [top, right, bottom, left] = node.layout?.padding ?? [0, 0, 0, 0];
  // Empty strings mean "Figma does not define this", so the element diff skips the property.
  return {
    color: t?.color ?? "",
    backgroundColor: solid ?? "",
    backgroundImage: gradient ?? "",
    fontFamily: t?.fontFamily ?? "",
    fontSize: t ? px(t.fontSize) : "",
    fontWeight: t ? String(t.fontWeight) : "",
    lineHeight: t?.lineHeight ?? "",
    letterSpacing: t?.letterSpacing ?? "",
    textTransform: t?.textCase ?? "",
    textAlign: t?.align ?? "",
    borderRadius: node.radius ?? "",
    borderTopWidth: node.stroke ? px(node.stroke.width) : "",
    borderTopColor: node.stroke?.color ?? "",
    boxShadow: node.shadow ?? "",
    paddingTop: node.layout ? px(top) : "",
    paddingRight: node.layout ? px(right) : "",
    paddingBottom: node.layout ? px(bottom) : "",
    paddingLeft: node.layout ? px(left) : "",
    gap: node.layout ? px(node.layout.gap) : "",
    opacity: node.opacity === 1 ? "" : String(node.opacity),
  };
}

/** Text layers, painted layers and vectors, in the same shape Beam measures from a browser page. */
export function bundleToElements(frame: BundleNode): CapturedElement[] {
  const out: CapturedElement[] = [];
  const visit = (node: BundleNode, path: string) => {
    const painted = node.fills.length > 0 || node.stroke || node.shadow;
    if (node.text || painted || node.svg)
      out.push({
        path,
        tag: ANY_TAG,
        text: node.text?.characters.replace(/\s+/g, " ").trim().slice(0, 120) ?? "",
        box: { ...node.box },
        style: styleOf(node),
      });
    if (!node.svg) node.children.forEach((child, i) => visit(child, `${path}>${child.name}:${i + 1}`));
  };
  visit(frame, frame.name);
  return out;
}

/** Top-level blocks of the frame, opening a single wrapper layer the way page sections are found. */
export function bundleSections(frame: BundleNode): CapturedSection[] {
  let level = frame;
  while (level.children.length === 1 && (level.children[0]?.box.height ?? 0) >= level.box.height * 0.9) level = level.children[0]!;
  return level.children
    .filter((c) => c.box.height > 40)
    .sort((a, b) => a.box.y - b.box.y)
    .map((c, index) => ({ index, label: c.name, top: Math.round(c.box.y), height: Math.round(c.box.height) }));
}
