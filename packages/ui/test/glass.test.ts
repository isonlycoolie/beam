import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(import.meta.dirname, "..");
const css = readFileSync(join(root, "styles", "glass.css"), "utf8");
const source = (name: string) => readFileSync(join(root, "registry", "components", name, `${name}.tsx`), "utf8");

// Every surface glass mode styles, and the component that renders it: a renamed data-slot would silently drop glass.
const SLOTS: Record<string, string[]> = {
  card: ["card"],
  sidebar: ["sidebar-inner", "sidebar-inset"],
  menubar: ["menubar", "menubar-content", "menubar-sub-content"],
  "navigation-menu": ["navigation-menu-list", "navigation-menu-viewport"],
  dialog: ["dialog-content"],
  "alert-dialog": ["alert-dialog-content"],
  sheet: ["sheet-content"],
  drawer: ["drawer-content"],
  popover: ["popover-content"],
  "hover-card": ["hover-card-content"],
  "dropdown-menu": ["dropdown-menu-content", "dropdown-menu-sub-content"],
  "context-menu": ["context-menu-content", "context-menu-sub-content"],
  select: ["select-content", "select-trigger"],
  command: ["command"],
  input: ["input"],
  textarea: ["textarea"],
  "input-group": ["input-group", "input-group-input"],
  tabs: ["tabs-list", "tabs-trigger"],
  button: ["button"],
  badge: ["badge"],
};

describe("glass mode", () => {
  for (const [component, slots] of Object.entries(SLOTS))
    it(`${component} renders the slots glass.css styles`, () => {
      for (const slot of slots) {
        expect(source(component), `${component} data-slot="${slot}"`).toContain(`data-slot="${slot}"`);
        expect(css, `glass.css ${slot}`).toContain(`[data-slot="${slot}"]`);
      }
    });

  it("falls back to solid surfaces for reduced transparency", () => {
    expect(css).toMatch(/@media \(prefers-reduced-transparency: reduce\)[^]*--glass-blur: 0px/);
    expect(css).toMatch(/@media \(prefers-reduced-transparency: reduce\)[^]*\[data-liquid-warp\]/);
  });

  it("has a dark tint for dark mode", () => {
    expect(css).toMatch(/\.dark\[data-surface="glass"\][^]*--glass-bg: rgb\(24 26 34/);
  });
});
