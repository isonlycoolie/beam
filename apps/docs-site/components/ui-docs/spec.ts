import { readFileSync } from "node:fs";
import { join } from "node:path";

export type ComponentSpec = {
  name: string;
  title: string;
  summary: string;
  source: string;
  use_when: string[];
  avoid_when: string[];
  props: Record<string, string>;
  variants: string[];
  /** Style tabs on the docs page, one example file each. */
  styles?: string[];
  composes_with: string[];
  copy: Record<string, string>;
  states: string[];
  a11y: string[];
  rules: string[];
};

const REGISTRY = join(process.cwd(), "..", "..", "packages", "ui", "registry", "components");

/** The same spec.json agents read through ui_get. */
export function readSpec(name: string): ComponentSpec {
  return JSON.parse(readFileSync(join(REGISTRY, name, "spec.json"), "utf8")) as ComponentSpec;
}
