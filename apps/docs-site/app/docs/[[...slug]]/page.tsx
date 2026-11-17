import { DocsBody, DocsPage } from "fumadocs-ui/layouts/notebook/page";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageActions } from "@/components/page-actions";
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
      breadcrumb={{ enabled: true, includeRoot: true, includePage: true }}
      tableOfContent={{ header: <PageActions markdownUrl={markdownUrl} pageUrl={`https://beam.dev${page.url}`} /> }}
      footer={{ enabled: true }}
    >
      <h1 className="beam-title">{page.data.title}</h1>
      {page.data.description && <p className="beam-lead mb-2">{page.data.description}</p>}
      <DocsBody>
        <Body components={defaultMdxComponents} />
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
