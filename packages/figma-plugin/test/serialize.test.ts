import { describe, expect, it } from "vitest";
import { paintToCss, serializeNode, unitToCss, type NodeLike } from "../src/serialize.js";

const card: NodeLike = {
  id: "1:1",
  name: "Pricing card",
  type: "FRAME",
  absoluteBoundingBox: { x: 100, y: 200, width: 360, height: 480 },
  fills: [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }, { type: "SOLID", visible: false, color: { r: 0, g: 0, b: 0 } }],
  strokes: [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.92 } }],
  strokeWeight: 1,
  cornerRadius: 16,
  effects: [{ type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 0.08 }, offset: { x: 0, y: 8 }, radius: 24, spread: 0 }],
  layoutMode: "VERTICAL",
  paddingTop: 32, paddingRight: 24, paddingBottom: 32, paddingLeft: 24, itemSpacing: 12,
  primaryAxisAlignItems: "MIN", counterAxisAlignItems: "CENTER",
  children: [
    {
      id: "1:2",
      name: "Title",
      type: "TEXT",
      absoluteBoundingBox: { x: 124, y: 232, width: 312, height: 40 },
      fills: [{ type: "SOLID", color: { r: 0.0627, g: 0.0941, b: 0.1255 } }],
      characters: "Team plan",
      fontName: { family: "Inter", style: "Semi Bold" },
      fontSize: 32,
      fontWeight: 600,
      lineHeight: { unit: "PERCENT", value: 125 },
      letterSpacing: { unit: "PERCENT", value: -2 },
      textAlignHorizontal: "CENTER",
      textCase: "ORIGINAL",
    },
    { id: "1:3", name: "Hidden", type: "TEXT", visible: false, characters: "x" },
  ],
};

describe("figma plugin serializer", () => {
  it("converts paints and units to CSS", () => {
    expect(paintToCss({ type: "SOLID", color: { r: 1, g: 0.5, b: 0 }, opacity: 0.5 })).toBe("rgba(255, 128, 0, 0.5)");
    expect(paintToCss({ type: "IMAGE", imageHash: "abc" })).toBe("image:abc");
    expect(paintToCss({ type: "GRADIENT_LINEAR", gradientStops: [{ color: { r: 0, g: 0, b: 0, a: 1 }, position: 0 }, { color: { r: 1, g: 1, b: 1, a: 1 }, position: 1 }] }))
      .toBe("linear-gradient(rgb(0, 0, 0) 0%, rgb(255, 255, 255) 100%)");
    expect(unitToCss({ unit: "AUTO" }, 16)).toBe("normal");
    expect(unitToCss({ unit: "PIXELS", value: 24 }, 16)).toBe("24px");
  });

  it("serializes a frame relative to itself with layout, effects and text", () => {
    const node = serializeNode(card, { x: 100, y: 200 });

    expect(node.box).toEqual({ x: 0, y: 0, width: 360, height: 480 });
    expect(node.fills).toEqual(["rgb(255, 255, 255)"]);
    expect(node.stroke).toEqual({ color: "rgb(230, 230, 235)", width: 1 });
    expect(node.radius).toBe("16px");
    expect(node.shadow).toBe("0px 8px 24px 0px rgba(0, 0, 0, 0.08)");
    expect(node.layout).toEqual({ mode: "column", padding: [32, 24, 32, 24], gap: 12, justify: "min", align: "center" });
    expect(node.children).toHaveLength(1);
    expect(node.children[0]).toMatchObject({
      box: { x: 24, y: 32, width: 312, height: 40 },
      fills: [],
      text: { characters: "Team plan", fontFamily: "Inter", fontWeight: 600, fontSize: 32, lineHeight: "40px", letterSpacing: "-0.64px", align: "center", textCase: "none", color: "rgb(16, 24, 32)" },
    });
  });
});
