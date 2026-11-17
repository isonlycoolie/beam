import type { CloneSpec } from "./clone-service.js";
import type { TokenCount } from "./tokens.js";

const list = (items: TokenCount[], limit: number) =>
  items.slice(0, limit).map((t) => `- \`${t.value}\` (${t.count}x)`).join("\n") || "- none";

/** What the source is and which files describe it: a captured web page or a Figma export. */
export type BriefSource = { intro: string; files: string };

export function webSource(spec: CloneSpec): BriefSource {
  const count = (kind: string) => spec.assets.filter((a) => a.kind === kind).length;
  return {
    intro: "Every value below was measured from the live page. Use these values exactly. If something you need is not here, look it up in `spec.json` or `structure.html`; never invent it.",
    files: [
      "- `spec.json`: every visible element per breakpoint with its box and computed styles",
      "- `structure.html`: the rendered HTML (scripts removed) for structure and copy",
      `- ${spec.breakpoints.map((b) => `\`${b.screenshot}\``).join(", ")}: full-page screenshots`,
      `- ${spec.fontsCss ? "`fonts.css`: the source's @font-face rules pointing at the saved font files" : "No @font-face rules found: the page uses system fonts"}`,
      `- \`fonts/\` (${count("font")}), \`images/\` (${count("image")}), \`stylesheets/\` (${count("stylesheet")}): the original files`,
    ].join("\n"),
  };
}

/** The agent's starting point: what to build, in what order, and the exact values the source uses. */
export function renderCloneBrief(spec: CloneSpec, source: BriefSource = webSource(spec)): string {
  const widest = spec.breakpoints[0];
  const t = spec.tokens;
  return `# Clone brief: ${spec.title || spec.url}

Source: ${spec.url}
Captured: ${spec.capturedAt}

${source.intro}

## Files in this folder

${source.files}

## Build order (sections at ${widest?.width ?? "?"}px)

${widest?.sections.map((s) => `${s.index + 1}. \`${s.label}\`: y ${s.top}, height ${s.height}px`).join("\n") || "1. The page has no separate sections: build it top to bottom."}

Page heights: ${spec.breakpoints.map((b) => `${b.width}px wide is ${b.height}px tall`).join("; ")}.

## Type styles (largest first)

| Font | Size | Weight | Line height | Letter spacing | Used | Example |
| --- | --- | --- | --- | --- | --- | --- |
${t.typeStyles.slice(0, 16).map((s) => `| ${s.fontFamily.split(",")[0]} | ${s.fontSize} | ${s.fontWeight} | ${s.lineHeight} | ${s.letterSpacing} | ${s.count} | ${s.sample.replace(/\|/g, "/")} |`).join("\n")}

## Text colours
${list(t.colors, 12)}

## Background colours
${list(t.backgrounds, 12)}

## Spacing values (padding and gap)
${list(t.spacing, 16)}

## Corner radii
${list(t.radii, 10)}

## Shadows
${list(t.shadows, 8)}

## Check your work

After each section, run:

\`\`\`bash
npx usebeam verify --reference ${spec.url} --target <your local url>
\`\`\`
`;
}
