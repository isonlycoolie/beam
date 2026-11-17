import { join, relative } from "node:path";
import { captureForClone, type CloneResult } from "@beam/core";
import { heading, label, muted, path, success } from "../terminal.js";
import { parseBreakpoints } from "./verify.js";

export type CloneOptions = { breakpoints?: string; dark?: boolean; json?: boolean; cwd?: string };

/** Captures a live page so an agent can rebuild it from measured values instead of guesses. */
export async function cloneCommand(url: string, options: CloneOptions = {}): Promise<void> {
  let parsed: URL | undefined;
  try {
    parsed = new URL(url);
  } catch {
    parsed = undefined;
  }
  if (!parsed || !/^https?:$/.test(parsed.protocol))
    throw Object.assign(new Error("Clone needs a full http or https URL."), {
      payload: { code: "BEAM_INVALID_INPUT", message: "Clone needs a full http or https URL.", exitCode: 2, fix: "Use beam clone https://example.com/page." },
    });

  const cwd = options.cwd ?? process.cwd();
  const result = await captureForClone({ url: parsed.href, cwd, breakpoints: parseBreakpoints(options.breakpoints), colorScheme: options.dark ? "dark" : "light" });
  process.stdout.write(options.json ? `${JSON.stringify(summary(result), null, 2)}\n` : formatClone(result, cwd));
}

function summary({ dir, spec }: CloneResult) {
  return {
    dir,
    url: spec.url,
    title: spec.title,
    breakpoints: spec.breakpoints.map((b) => ({ width: b.width, height: b.height, sections: b.sections.length, elements: b.elements.length })),
    assets: spec.assets.length,
    brief: join(dir, "brief.md"),
  };
}

export function formatClone(result: CloneResult, cwd: string): string {
  const { dir, spec } = result;
  const count = (kind: string) => spec.assets.filter((a) => a.kind === kind).length;
  const lines = [
    heading("Beam clone"),
    "",
    success(`Captured ${spec.title || spec.url}`),
    ...spec.breakpoints.map((b) => label(`${b.width}px`, `${b.sections.length} sections, ${b.elements.length} elements, ${b.height}px tall`)),
    label("Files", `${count("font")} fonts, ${count("image")} images, ${count("stylesheet")} stylesheets`),
    label("Brief", path(relative(cwd, join(dir, "brief.md")))),
    "",
    muted("Give the brief to your agent. With the clone skill installed (beam add clone) it rebuilds section by section and verifies each one."),
  ];
  return `${lines.join("\n")}\n`;
}
