import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { DocsBody, DocsPage } from "fumadocs-ui/layouts/notebook/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPalettes } from "@beam/ui/palettes/palettes.ts";
import { PaletteShowcase } from "@/components/showcase/palette-showcase";
import { PaletteStrip } from "@/components/ui-docs/palette-strip";

const ROLES = [
  ["Primary", "primary"],
  ["Secondary", "brand-secondary"],
  ["Accent", "brand-accent"],
  ["Text", "text-1"],
  ["Muted text", "text-2"],
  ["Background", "background"],
  ["Surface", "surface-2"],
  ["Border", "border"],
  ["Success", "success"],
  ["Warning", "warning"],
  ["Danger", "danger"],
  ["Info", "info"],
  ["Chart 1-5", "chart"],
] as const;

const Dot = ({ c }: { c: string }) => (
  <span className="inline-block size-5 shrink-0 rounded-[5px] border border-black/10 align-middle" style={{ background: c }} title={c} />
);

/** Every role and its colour, light and dark. */
function PaletteRoles({ light, dark }: { light: Record<string, string>; dark: Record<string, string> }) {
  const cell = (t: Record<string, string>, key: string) =>
    key === "chart" ? (
      <span className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Dot key={i} c={t[`chart-${i}`]!} />
        ))}
      </span>
    ) : (
      <span className="flex items-center gap-2">
        <Dot c={t[key]!} />
        <code className="text-xs">{t[key]}</code>
      </span>
    );
  return (
    <table className="not-prose my-4 w-full text-sm">
      <thead>
        <tr className="text-left text-fd-muted-foreground">
          <th className="py-2 font-medium">Role</th>
          <th className="py-2 font-medium">Light</th>
          <th className="py-2 font-medium">Dark</th>
        </tr>
      </thead>
      <tbody>
        {ROLES.map(([label, key]) => (
          <tr key={key} className="border-t border-fd-border">
            <td className="py-2 pr-4">{label}</td>
            <td className="py-2 pr-4">{cell(light, key)}</td>
            <td className="py-2">{cell(dark, key)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

type Props = { params: Promise<{ id: string }> };

const TOC = [
  { title: "Colours", url: "#colours", depth: 2 },
  { title: "Showcase", url: "#showcase", depth: 2 },
  { title: "Install", url: "#install", depth: 2 },
];

/** One palette: its strip, sections shown in it, and one install line. */
export default async function Page({ params }: Props) {
  const { id } = await params;
  const p = buildPalettes().find((x) => x.id === id);
  if (!p) notFound();
  return (
    <DocsPage toc={TOC} breadcrumb={{ enabled: true, includeRoot: true, includePage: true }} footer={{ enabled: true }}>
      <h1 className="beam-title">{p.name}</h1>
      <p className="beam-lead mb-2">{p.description}</p>
      {/* Only this palette's tokens: the 100 harmony palettes are not in global.css. */}
      <style dangerouslySetInnerHTML={{ __html: p.css }} />
      <DocsBody>
        <div className="not-prose my-6">
          <PaletteStrip colors={p.display} height="h-40" />
        </div>
        <h2 id="colours">Colours</h2>
        <PaletteRoles light={p.light} dark={p.dark} />
        <h2 id="showcase">Showcase</h2>
        <PaletteShowcase palette={p.id} />
        <h2 id="install">Install</h2>
        <DynamicCodeBlock lang="bash" code={`npx usebeam add ui/palette-${p.id}`} />
        <p className="text-sm text-fd-muted-foreground">
          Then set <code>data-theme=&quot;{p.id}&quot;</code> on <code>&lt;body&gt;</code>. Colours from <a href={p.url}>{p.source}</a> ({p.licence}).
        </p>
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return buildPalettes().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = buildPalettes().find((x) => x.id === id);
  return { title: p ? `${p.name} palette` : "Palettes" };
}
