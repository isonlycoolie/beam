import {
  Boxes,
  Cloud,
  Database,
  FileJson,
  GitCompare,
  ListChecks,
  RotateCcw,
  Shield,
  Terminal,
  Users,
  Workflow,
} from "lucide-react";
import type { ReactNode } from "react";
import { capabilities } from "../content/capabilities";
import { commands, mcpTools } from "../content/commands";
import { type DocBlock, type DocSection } from "../content/docs";
import { ArchitectureDiagram } from "./architecture-diagram";
import { Callout } from "./callout";
import { CapabilityCard } from "./capability-card";
import { CodeBlock } from "./code-block";
import { EditionTable } from "./edition-table";
import { LeftSidebar } from "./left-sidebar";
import { RightToc } from "./right-toc";
import { SectionCard } from "./section-card";
import { TopNav } from "./top-nav";

const icons = [
  Terminal,
  Database,
  Shield,
  Workflow,
  Boxes,
  FileJson,
  GitCompare,
  Cloud,
  Users,
];

type DocsShellProps = {
  section: DocSection;
};

export function DocsShell({ section }: DocsShellProps) {
  const tocItems = buildTocItems(section);

  return (
    <div className="siteShell">
      <TopNav activeSlug={section.slug} />
      <div className="docsGrid">
        <LeftSidebar activeSlug={section.slug} />
        <main className="content">
          <section className="docSection" id={section.id}>
            <p className="kicker">{section.kicker}</p>
            <h1>{section.title}</h1>
            <p className="sectionBody">
              <InlineText text={section.body} />
            </p>
            {section.details ? (
              <div className="sectionDetails" id="details">
                {section.details.map((detail) => (
                  <p key={detail}>
                    <InlineText text={detail} />
                  </p>
                ))}
              </div>
            ) : null}
            {section.bullets ? (
              <ul className="sectionList" id="principles">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>
                    <InlineText text={bullet} />
                  </li>
                ))}
              </ul>
            ) : null}
            {section.code ? (
              <div id="usage">
                <CodeBlock
                  code={section.code}
