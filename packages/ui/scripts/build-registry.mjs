// Builds shadcn-compatible registry items from packages/ui.
// Usage: node scripts/build-registry.mjs <outDir> [baseUrl]
// Every item installs on its own: `npx shadcn add <baseUrl>/<name>.json` pulls exactly its files and dependencies.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildPalettes } from "../palettes/palettes.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const outDir = process.argv[2] ?? join(root, "dist", "r");
const base = (process.argv[3] ?? process.env.BEAM_REGISTRY_URL ?? "https://beam.dev/r").replace(/\/$/, "");
const read = (...p) => readFileSync(join(root, ...p), "utf8");
const url = (name) => `${base}/${name}.json`;

/** Package imports become app paths (shadcn's layout: @/lib, @/components/ui). */
function rewrite(source) {
  return source
    .replaceAll(/from "(?:\.\.\/)+lib\/cn"/g, 'from "@/lib/beam"')
    .replaceAll(/from "(?:\.\.\/)+lib\/use-mobile"/g, 'from "@/hooks/use-mobile"')
    .replaceAll(/from "(?:\.\.\/)+icons\/icon"/g, 'from "@/components/ui/icon"')
    .replaceAll(/from "\.\.\/([a-z-]+)(?:\/\1)?"/g, 'from "@/components/ui/$1"');
}

/** npm packages and sibling components a file imports. */
function imports(source) {
  const specifiers = [...source.matchAll(/from "([^"]+)"/g)].map((m) => m[1]);
  return {
    packages: [...new Set(specifiers.filter((s) => !s.startsWith(".") && s !== "react").map((s) => (s.startsWith("@") ? s.split("/").slice(0, 2).join("/") : s.split("/")[0])))],
    siblings: [...new Set(specifiers.map((s) => s.match(/^\.\.\/([a-z-]+)(?:\/\1)?$/)?.[1]).filter(Boolean))],
    usesIcon: specifiers.some((s) => /icons\/icon$/.test(s)),
    usesMobile: specifiers.some((s) => /lib\/use-mobile$/.test(s)),
  };
}

const items = [];
items.push({
  name: "beam-utils",
  type: "registry:lib",
  title: "Beam utils",
  description: "cn() that knows Beam's type steps, so text sizes and colours merge correctly.",
  dependencies: ["clsx", "tailwind-merge"],
  files: [{ path: "lib/beam.ts", type: "registry:lib", target: "lib/beam.ts", content: read("lib", "cn.ts") }],
});
const palettes = buildPalettes();
const paletteFile = (p) => ({ path: `palettes/${p.id}.css`, type: "registry:file", target: `styles/beam/palettes/${p.id}.css`, content: p.css });
items.push({
  name: "beam-tokens",
  type: "registry:file",
  title: "Beam tokens",
  description: "Tokens, the Geist type scale, the Tailwind mapping and the default Graphite palette. Import them in your global CSS.",
  files: [
    ...["tokens.css", "type.css", "tailwind.css"].map((f) => ({ path: `styles/${f}`, type: "registry:file", target: `styles/beam/${f}`, content: read("styles", f) })),
    paletteFile(palettes[0]),
  ],
});
// One item per palette: `npx usebeam add ui/palette-navy`, then set data-theme="navy".
for (const p of palettes.slice(1))
  items.push({
    name: `palette-${p.id}`,
    type: "registry:theme",
    title: `${p.name} palette`,
    description: p.description,
    registryDependencies: [url("beam-tokens")],
    files: [paletteFile(p)],
    meta: { beam: { display: p.display } },
  });
items.push({
  name: "icon",
  type: "registry:ui",
  title: "Icon",
  description: "Beam's single icon component over the free Hugeicons set (MIT).",
  dependencies: ["@hugeicons/react", "@hugeicons/core-free-icons"],
  registryDependencies: [url("beam-utils")],
  files: [{ path: "icons/icon.tsx", type: "registry:ui", target: "components/ui/icon.tsx", content: rewrite(read("icons", "icon.tsx")) }],
});

for (const name of readdirSync(join(root, "registry", "components")).sort()) {
  const source = read("registry", "components", name, `${name}.tsx`);
  const spec = JSON.parse(read("registry", "components", name, "spec.json"));
  const used = imports(source);
  items.push({
    name,
    type: "registry:ui",
    title: spec.title,
    description: spec.summary,
    dependencies: used.packages,
    registryDependencies: [
      url("beam-utils"),
      url("beam-tokens"),
      ...(used.usesIcon ? [url("icon")] : []),
      ...(used.usesMobile ? [url("use-mobile")] : []),
      ...used.siblings.map(url),
    ],
    files: [{ path: `registry/components/${name}/${name}.tsx`, type: "registry:ui", target: `components/ui/${name}.tsx`, content: rewrite(source) }],
    // Agents installing through shadcn still get the rules: when to use it, copy limits, rule ids.
    meta: { beam: spec },
  });
}

items.push({
  name: "use-mobile",
  type: "registry:hook",
  title: "useIsMobile",
  description: "True below the 768px breakpoint. The Sidebar uses it to open as a sheet on phones.",
  files: [{ path: "lib/use-mobile.ts", type: "registry:hook", target: "hooks/use-mobile.ts", content: read("lib", "use-mobile.ts") }],
});

// Screens: whole pages from packages/ui/registry/screens, installed as a page plus its components.
// `npx usebeam add screens/<id>` -> app/<id>/page.tsx and components/*.tsx.
const screens = [];
const screensDir = join(root, "registry", "screens");
for (const id of readdirSync(screensDir).sort()) {
  const spec = JSON.parse(read("registry", "screens", id, "spec.json"));
  const files = [];
  const packages = new Set();
  const components = new Set();
  for (const rel of spec.files) {
    let content = read("registry", "screens", id, rel);
    if (rel.endsWith(".tsx")) {
      for (const m of content.matchAll(/from "([^"]+)"/g)) {
        const s = m[1];
        const ui = s.match(/^@beam\/ui\/components\/([a-z-]+)$/);
        if (ui) components.add(ui[1]);
        else if (!s.startsWith(".") && !s.startsWith("@beam/") && s !== "react") packages.add(s.startsWith("@") ? s.split("/").slice(0, 2).join("/") : s.split("/")[0]);
      }
      content = content
        .replaceAll(/from "@beam\/ui\/components\/([a-z-]+)"/g, 'from "@/components/ui/$1"')
        .replaceAll('from "@beam/ui/lib/cn"', 'from "@/lib/beam"')
        .replaceAll('from "@beam/ui/lib/use-mobile"', 'from "@/hooks/use-mobile"')
        .replaceAll(/from "\.\/components\/([a-z-]+)"/g, 'from "@/components/$1"')
        .replaceAll(/from "\.\/([a-z-]+)"/g, (whole, name) => (rel.startsWith("components/") ? `from "@/components/${name}"` : whole));
    }
    const page = !rel.startsWith("components/");
    files.push({
      path: `registry/screens/${id}/${rel}`,
      type: rel === "page.tsx" ? "registry:page" : page ? "registry:file" : "registry:component",
      target: page ? `app/${id}/${rel}` : rel,
      content,
    });
  }
  screens.push({
    name: id,
    type: "registry:block",
    title: spec.title,
    description: spec.summary,
    dependencies: [...packages].sort(),
    registryDependencies: [url("beam-utils"), url("beam-tokens"), ...[...components].sort().map(url)],
    files,
    meta: { beam: spec },
  });
}

mkdirSync(join(outDir, "screens"), { recursive: true });
for (const item of screens) {
  writeFileSync(join(outDir, "screens", `${item.name}.json`), `${JSON.stringify({ $schema: "https://ui.shadcn.com/schema/registry-item.json", ...item }, null, 2)}
`);
}
// Sidebar layouts are components too: `npx usebeam add ui/sidebar-calendar` reads /r/sidebar-calendar.json.
const sidebars = screens.filter((s) => s.meta.beam.group === "Sidebar");
for (const item of sidebars) {
  writeFileSync(join(outDir, `${item.name}.json`), `${JSON.stringify({ $schema: "https://ui.shadcn.com/schema/registry-item.json", ...item }, null, 2)}\n`);
}
// The screens index agents read (MCP screens_list): what each screen is for and what it is built from.
const screenIndex = screens.map((s) => ({
  id: s.name,
  group: s.meta.beam.group,
  title: s.meta.beam.title,
  summary: s.meta.beam.summary,
  components: s.registryDependencies.filter((u) => !/beam-(utils|tokens)\.json$/.test(u)).map((u) => u.split("/").pop().replace(/\.json$/, "")),
  files: s.files.map((f) => f.target),
  install: `npx usebeam add screens/${s.name}`,
}));
writeFileSync(join(outDir, "screens", "index.json"), `${JSON.stringify(screenIndex, null, 2)}\n`);

mkdirSync(outDir, { recursive: true });
for (const item of items) {
  writeFileSync(join(outDir, `${item.name}.json`), `${JSON.stringify({ $schema: "https://ui.shadcn.com/schema/registry-item.json", ...item }, null, 2)}\n`);
}
writeFileSync(
  join(outDir, "registry.json"),
  `${JSON.stringify({ $schema: "https://ui.shadcn.com/schema/registry.json", name: "beam", homepage: "https://beam.dev", items: items.map(({ files, ...rest }) => ({ ...rest, files: files.map(({ content, ...f }) => f) })) }, null, 2)}\n`,
);
console.log(`registry: ${items.length} items, ${screens.length} screens, ${sidebars.length} sidebar layouts -> ${outDir} (${base})`);
