import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(import.meta.dirname, "..", "registry", "components");
const REQUIRED = ["name", "title", "summary", "source", "use_when", "avoid_when", "props", "variants", "composes_with", "copy", "states", "a11y", "rules"];
// Rule ids must exist in the brain's catalogue; this list grows with it.
const KNOWN_RULES = new Set([
  "action.one-primary", "copy.verbs-on-actions", "copy.length-caps", "copy.sentence-case", "copy.sibling-parity", "form.labels-visible",
  "form.single-column", "row.equal-heights", "row.aligned-insides", "card.no-stretch", "type.max-three", "type.one-h1", "grid.no-orphans",
  "skeleton.fidelity", "loader.no-shift", "loader.timing", "empty.actionable", "state.complete",
]);

describe("component specs", () => {
  const names = readdirSync(root);

  it("every component has its source, an index and a spec", () => {
    for (const name of names) {
      expect(existsSync(join(root, name, `${name}.tsx`)), name).toBe(true);
      expect(existsSync(join(root, name, "index.ts")), name).toBe(true);
      expect(existsSync(join(root, name, "spec.json")), name).toBe(true);
    }
  });

  for (const name of names)
    it(`${name} spec is complete and cites known rules`, () => {
      const spec = JSON.parse(readFileSync(join(root, name, "spec.json"), "utf8"));
      for (const key of REQUIRED) expect(spec, `${name}.${key}`).toHaveProperty(key);
      expect(spec.name).toBe(name);
      expect(spec.use_when.length).toBeGreaterThan(0);
      expect(spec.avoid_when.length).toBeGreaterThan(0);
      expect(spec.rules.filter((r: string) => !KNOWN_RULES.has(r))).toEqual([]);
    });
});
