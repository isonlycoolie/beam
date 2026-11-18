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
      // Every style tab on the docs page is one example file.
      for (const style of spec.styles ?? []) expect(existsSync(join(root, name, "examples", `${style}.tsx`)), `${name}/${style}`).toBe(true);
    });
});

// One styling contract: learn one component's props and hooks and you know them all.
describe("styling contract", () => {
  const VOCAB = new Set(["default", "secondary", "outline", "ghost", "destructive"]);
  const source = (name: string) => readFileSync(join(root, name, `${name}.tsx`), "utf8");
  const keys = (src: string, block: string) => {
    const m = src.match(new RegExp(`${block}:\s*\{([\s\S]*?)\n\s{0,8}\}`));
    return m ? [...m[1]!.matchAll(/^\s*"?([a-z-]+)"?\s*:/gm)].map((k) => k[1]!) : [];
  };

  for (const name of readdirSync(root)) {
    const src = source(name);
    const sizes = keys(src, "size").filter((s) => !s.startsWith("icon"));
    if (sizes.length > 1)
      it(`${name} takes the shared sizes sm, md and lg`, () => {
        for (const s of ["sm", "md", "lg"]) expect(sizes, `${name} size ${s}`).toContain(s);
      });
    const variants = keys(src, "variant");
    if (variants.length)
      it(`${name} names its variants from the shared words, or documents them`, () => {
        const spec = JSON.parse(readFileSync(join(root, name, "spec.json"), "utf8"));
        for (const v of variants) expect(VOCAB.has(v) || spec.variants.includes(v), `${name} variant "${v}"`).toBe(true);
        if (variants.includes("danger")) expect(variants, `${name} also takes "destructive"`).toContain("destructive");
      });
  }

  it("Button, Badge, Input, Toggle and Select expose data-slot, data-size (and data-variant) for CSS", () => {
    for (const name of ["button", "badge", "input", "toggle", "select"]) expect(source(name), name).toMatch(/data-size=/);
    for (const name of ["button", "badge"]) expect(source(name), name).toMatch(/data-variant=/);
  });
});
