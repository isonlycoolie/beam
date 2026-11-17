import { describe, expect, it } from "vitest";
import { ICON_SIZES } from "../icons/icon";
import { cn } from "../lib/cn";

describe("foundations", () => {
  it("merges classes with later Tailwind classes winning", () => {
    expect(cn("px-2 text-sm", false && "hidden", "px-4")).toBe("text-sm px-4");
  });

  it("keeps a type step and a text colour together", () => {
    expect(cn("text-primary-foreground", "text-body")).toBe("text-primary-foreground text-body");
    expect(cn("text-h2 text-numeric text-text-1")).toBe("text-h2 text-numeric text-text-1");
    expect(cn("text-small", "text-body")).toBe("text-body");
  });

  it("keeps icon sizes on the 4px grid with strokes that thin as icons grow", () => {
    expect(Object.values(ICON_SIZES).map((s) => s.size % 4)).toEqual([0, 0, 0]);
    expect(ICON_SIZES.lg.strokeWidth).toBeLessThan(ICON_SIZES.sm.strokeWidth);
  });
});
