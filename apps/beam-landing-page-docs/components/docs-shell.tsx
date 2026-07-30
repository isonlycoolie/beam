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
                  language={
                    section.code.trim().startsWith("{") ? "json" : "bash"
                  }
                />
              </div>
            ) : null}
            {section.sequence ? (
              <GuidePanel
                icon={<ListChecks size={17} />}
                id="sequence"
                items={section.sequence}
                title="Run Sequence"
              />
            ) : null}
            {section.expectedOutput ? (
              <GuidePanel
                id="expected-output"
                title="Expected Output"
                tone="terminal"
              >
                <p>
                  <InlineText text={section.expectedOutput} />
                </p>
              </GuidePanel>
            ) : null}
            {section.files ? (
              <GuidePanel
                icon={<FileJson size={17} />}
                id="files"
                items={section.files}
                title="Files And Artifacts"
              />
            ) : null}
            {section.nextStep ? (
              <GuidePanel id="next-step" title="Next Step">
                <p>
                  <InlineText text={section.nextStep} />
                </p>
              </GuidePanel>
            ) : null}
            {section.recovery ? (
              <GuidePanel
                icon={<RotateCcw size={17} />}
                id="recovery"
                items={section.recovery}
                title="Recovery Paths"
              />
            ) : null}
            {section.blocks?.length ? (
              <div className="contentBlocks">
                {section.blocks.map((block) => (
                  <ContentBlock block={block} key={block.id} />
                ))}
              </div>
            ) : null}
            {section.id === "cli" ? <CommandGrid /> : null}
            {section.id === "mcp" ? <ToolGrid /> : null}
            {section.id === "capabilities" ? <CapabilityGrid /> : null}
            {section.id === "business" ? <EditionTable /> : null}
            {section.id === "architecture" ? <ArchitectureDiagram /> : null}
            {section.id === "security" ? (
              <Callout>
                Tokens stay local by default. Cloud sync and enterprise policy
                are explicit product boundaries, not hidden defaults.
              </Callout>
            ) : null}
          </section>
        </main>
        <RightToc items={tocItems} />
      </div>
    </div>
  );
}

function buildTocItems(section: DocSection) {
  const items = [{ href: `#${section.id}`, title: "Overview" }];

  if (section.blocks?.length) {
    return [
      ...items,
      ...section.blocks.map((block) => ({
        href: `#${block.id}`,
        title: block.title,
      })),
    ];
  }

  if (section.details?.length) {
    items.push({ href: "#details", title: "Details" });
  }

  if (section.bullets?.length) {
    items.push({ href: "#principles", title: "Principles" });
  }

  if (section.code) {
    items.push({ href: "#usage", title: "Usage" });
  }

  if (section.sequence?.length) {
    items.push({ href: "#sequence", title: "Run sequence" });
  }

  if (section.expectedOutput) {
    items.push({ href: "#expected-output", title: "Expected output" });
  }

  if (section.files?.length) {
    items.push({ href: "#files", title: "Files and artifacts" });
  }

  if (section.nextStep) {
    items.push({ href: "#next-step", title: "Next step" });
  }

  if (section.recovery?.length) {
    items.push({ href: "#recovery", title: "Recovery paths" });
  }

  if (section.id === "cli") {
    items.push({ href: "#commands", title: "Commands" });
  }

  if (section.id === "mcp") {
    items.push({ href: "#tools", title: "MCP tools" });
  }

  if (section.id === "capabilities") {
    items.push({ href: "#capability-list", title: "Capability list" });
  }

  if (section.id === "business") {
    items.push({ href: "#editions", title: "Editions" });
  }

  if (section.id === "architecture") {
    items.push({ href: "#diagram", title: "Architecture diagram" });
  }

  return items;
}

function ContentBlock({ block }: { block: DocBlock }) {
  return (
    <section className="contentBlock" id={block.id}>
      <h2>{block.title}</h2>
      {block.body?.map((paragraph) => (
        <p key={paragraph}>
          <InlineText text={paragraph} />
        </p>
      ))}
      {block.bullets ? (
        <ul>
          {block.bullets.map((bullet) => (
            <li key={bullet}>
              <InlineText text={bullet} />
            </li>
          ))}
        </ul>
      ) : null}
      {block.code ? (
        <CodeBlock code={block.code} language={block.codeLanguage ?? "bash"} />
      ) : null}
      {block.expected ? (
        <GuidePanel
          id={`${block.id}-expected`}
          items={block.expected}
          title="Expected Output"
          tone="terminal"
        />
      ) : null}
      {block.files ? (
        <GuidePanel
          icon={<FileJson size={17} />}
          id={`${block.id}-files`}
          items={block.files}
          title="Files And Artifacts"
        />
      ) : null}
    </section>
  );
}

function CommandGrid() {
  return (
    <div className="commandGrid" id="commands">
      {commands.map(([command, detail, slug]) => (
        <SectionCard href={`/docs/${slug}`} key={command} title={command}>
          <p>{detail}</p>
        </SectionCard>
      ))}
    </div>
  );
}

function GuidePanel({
  children,
  icon,
  id,
  items,
  title,
  tone,
}: {
  children?: ReactNode;
  icon?: ReactNode;
  id: string;
  items?: string[];
  title: string;
  tone?: "terminal";
}) {
  return (
    <section className={`guidePanel${tone ? ` ${tone}` : ""}`} id={id}>
      <div className="guidePanelHeader">
        <span>{icon ?? <Terminal size={17} />}</span>
        <h2>{title}</h2>
      </div>
      {items ? (
        <ol className="guideList">
          {items.map((item) => (
            <li key={item}>
              <InlineText text={item} />
            </li>
          ))}
        </ol>
      ) : null}
      {children}
    </section>
  );
}

function InlineText({ text }: { text: string }) {
  return renderInlineText(text);
}

function renderInlineText(text: string): ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code className="inlineCode" key={`${part}-${index}`}>
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}

function ToolGrid() {
  return (
    <div className="toolGrid" id="tools">
      {mcpTools.map((tool) => (
        <span key={tool}>{tool}</span>
      ))}
    </div>
  );
}

function CapabilityGrid() {
  return (
    <div className="capabilityGrid" id="capability-list">
      {capabilities.map((capability, index) => {
        const Icon = icons[index % icons.length] ?? Terminal;
        return (
          <CapabilityCard icon={Icon} key={capability} label={capability} />
        );
      })}
    </div>
  );
}
