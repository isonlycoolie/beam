import { DocsShell } from "../components/docs-shell";
import { getSectionBySlug } from "../content/docs";

export default function Page() {
  return <DocsShell section={getSectionBySlug()} />;
}
