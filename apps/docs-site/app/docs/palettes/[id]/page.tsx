import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { DocsBody, DocsPage } from "fumadocs-ui/layouts/notebook/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPalettes } from "@beam/ui/palettes/palettes.ts";
import { PaletteShowcase } from "@/components/showcase/palette-showcase";
import { PaletteStrip } from "@/components/ui-docs/palette-strip";

type Props = { params: Promise<{ id: string }> };

const TOC = [
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
      <DocsBody>
        <div className="not-prose my-6">
          <PaletteStrip colors={p.display} height="h-40" />
        </div>
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
