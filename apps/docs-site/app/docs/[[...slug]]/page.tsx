import { DocsBody, DocsPage } from "fumadocs-ui/layouts/notebook/page";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageActions } from "@/components/page-actions";
import { ComponentPreview } from "@/components/ui-docs/component-preview";
import { DoDont } from "@/components/ui-docs/do-dont";
import { InstallTabs } from "@/components/ui-docs/install-tabs";
import { AgentRules, PropsTable } from "@/components/ui-docs/spec-sections";
import { ColorSwatches, TypeScale } from "@/components/ui-docs/token-swatches";
import { IconBrowser } from "@/components/ui-docs/icon-browser";
import { PaletteGrid } from "@/components/ui-docs/palette-grid";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { source } from "@/lib/source";

type Props = { params: Promise<{ slug?: string[] }> };

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();
  const Body = page.data.body;
  const markdownUrl = `/llms.mdx/${(slug ?? []).join("/") || "index"}`;
  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      breadcrumb={{ enabled: true, includeRoot: true, includePage: true }}
      tableOfContent={{ header: <PageActions markdownUrl={markdownUrl} pageUrl={`https://beam.dev${page.url}`} /> }}
      footer={{ enabled: true }}
    >
      <h1 className="beam-title">{page.data.title}</h1>
      {page.data.description && <p className="beam-lead mb-2">{page.data.description}</p>}
      <DocsBody>
        <Body components={{ ...defaultMdxComponents, ComponentPreview, DoDont, InstallTabs, PropsTable, AgentRules, ColorSwatches, TypeScale, IconBrowser, PaletteGrid, Tab, Tabs }} />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();
  return { title: page.data.title, description: page.data.description };
}
