import { describe, expect, it } from "vitest";
import { discoverAssets } from "../src/index.js";

describe("discoverAssets", () => {
  it("identifies frame, raster, vector, icon, and decorative candidates", () => {
    const assets = discoverAssets({
      id: "1:1",
      name: "Frame",
      type: "FRAME",
      children: [
        {
          id: "1:2",
          name: "Photo",
          type: "RECTANGLE",
          fills: [{ type: "IMAGE", imageRef: "image_ref" }],
        },
        { id: "1:3", name: "Logo Icon", type: "VECTOR" },
        {
          id: "1:4",
          name: "Background Shape",
          type: "RECTANGLE",
          absoluteBoundingBox: { width: 800, height: 400 },
        },
      ],
    });

    expect(assets).toEqual([
      expect.objectContaining({ nodeId: "1:1", type: "frame" }),
      expect.objectContaining({ nodeId: "1:2", type: "raster" }),
      expect.objectContaining({ nodeId: "1:3", type: "icon" }),
      expect.objectContaining({ nodeId: "1:4", type: "decorative" }),
    ]);
  });
});
