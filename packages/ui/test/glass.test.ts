import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(import.meta.dirname, "..");
const css = readFileSync(join(root, "styles", "glass.css"), "utf8");
const source = (name: string) => readFileSync(join(root, "registry", "components", name, `${name}.tsx`), "utf8");

// Every surface glass mode styles, and the component that renders it: a renamed data-slot would silently drop glass.
const SLOTS: Record<string, string[]> = {
  card: ["card"],
  sidebar: ["sidebar-inner"],
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
        // Floating layers are covered by one rule for every *-content slot; the rest by name.
        const covered = css.includes(`[data-slot="${slot}"]`) || (slot.endsWith("-content") && css.includes('[data-slot$="-content"]'));
        expect(covered, `glass.css ${slot}`).toBe(true);
      }
    });

  it("falls back to solid surfaces for reduced transparency", () => {
    expect(css).toMatch(/@media \(prefers-reduced-transparency: reduce\)[^]*--beam-glass-frost: 0px/);
    expect(css).toMatch(/@media \(prefers-reduced-transparency: reduce\)[^]*\[data-liquid-warp\]/);
  });

  it("has a see-through dark tint and iOS dark rim", () => {
    expect(css).toMatch(/\.dark \{[^}]*--beam-glass-rim: 0\.13;[^}]*--beam-glass-tint: rgb\(40 40 40 \/ 0\.48\)/);
  });

  it("exposes the four liquid controls with iOS defaults", () => {
    for (const v of ["--beam-glass-bend: 1;", "--beam-glass-dispersion: 0.6;", "--beam-glass-frost: 3px;", "--beam-glass-rim: 0.3;"]) expect(css).toContain(v);
  });
});
