import { describe, expect, it } from "vitest";
import { ICON_SIZES } from "../icons/icon";
import { cn } from "../lib/cn";

describe("foundations", () => {
  it("merges classes with later Tailwind classes winning", () => {
    expect(cn("px-2 text-sm", false && "hidden", "px-4")).toBe("text-sm px-4");
  });

  it("keeps icon sizes on the 4px grid with strokes that thin as icons grow", () => {
    expect(Object.values(ICON_SIZES).map((s) => s.size % 4)).toEqual([0, 0, 0]);
    expect(ICON_SIZES.lg.strokeWidth).toBeLessThan(ICON_SIZES.sm.strokeWidth);
  });
});
