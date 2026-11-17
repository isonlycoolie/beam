import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { DocsBody, DocsPage } from "fumadocs-ui/layouts/notebook/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPalettes } from "@beam/ui/palettes/palettes.ts";
import { PaletteShowcase } from "@/components/showcase/palette-showcase";
import { PaletteStrip } from "@/components/ui-docs/palette-strip";
import { PaletteTokens } from "@/components/ui-docs/palette-tokens";

type Props = { params: Promise<{ id: string }> };

const TOC = [
  { title: "Showcase", url: "#showcase", depth: 2 },
  { title: "Tokens", url: "#tokens", depth: 2 },
  { title: "Install", url: "#install", depth: 2 },
  { title: "Credit", url: "#credit", depth: 2 },
];

/** One palette: its strip, real sections rebuilt in it, every token, and how to install it. */
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
        <p>Sections from products people already trust, rebuilt pixel by pixel and coloured only by this palette. Switch the site between light and dark to see both.</p>
        <PaletteShowcase palette={p.id} />
        <h2 id="tokens">Tokens</h2>
        <PaletteTokens light={p.light} dark={p.dark} adjustments={p.adjustments} css={p.css} />
        <h2 id="install">Install</h2>
        <DynamicCodeBlock lang="bash" code={`npx usebeam add ui/palette-${p.id}`} />
        <DynamicCodeBlock lang="tsx" code={`<body data-theme="${p.id}">`} />
        <h2 id="credit">Credit</h2>
        <p>
          Colours from <a href={p.url}>{p.source}</a> ({p.licence}), {p.version}. Beam maps each colour onto its tokens using the role the source documents for it.
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
