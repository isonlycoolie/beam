import { DocsBody, DocsPage } from "fumadocs-ui/layouts/notebook/page";
import { PaletteGrid } from "./palette-grid";

/** One sidebar filter: a colour family or a harmony scheme, and the palettes in it. */
export function PaletteFilterPage({ title, lead, family, scheme }: { title: string; lead: string; family?: string; scheme?: string }) {
  return (
    <DocsPage breadcrumb={{ enabled: true, includeRoot: true, includePage: true }} footer={{ enabled: false }}>
      <h1 className="beam-title">{title}</h1>
      <p className="beam-lead mb-2">{lead}</p>
      <DocsBody>
        <PaletteGrid family={family} scheme={scheme} />
      </DocsBody>
    </DocsPage>
  );
}
