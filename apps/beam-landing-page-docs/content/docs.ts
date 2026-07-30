import { commandDocs } from "./commands";

export type DocSection = {
  id: string;
  slug: string;
  kicker: string;
  title: string;
  body: string;
  details?: string[];
  bullets?: string[];
  code?: string;
  sequence?: string[];
  expectedOutput?: string;
  files?: string[];
  nextStep?: string;
  recovery?: string[];
  blocks?: DocBlock[];
};

export type DocBlock = {
  id: string;
  title: string;
  body?: string[];
  bullets?: string[];
  code?: string;
  codeLanguage?: "bash" | "json" | "txt";
  expected?: string[];
  files?: string[];
};

export const sections: DocSection[] = [
  {
    id: "introduction",
    slug: "introduction",
    kicker: "Beam Documentation",
    title: "Local-first design intelligence for coding agents.",
    body: "Beam is an open-source bridge that turns Figma frames into structured implementation context, rendered references, assets, tokens, snapshots, evidence, and visual comparison signals.",
    details: [
      "This page explains the product model and the order in which the documentation should be read. It intentionally avoids becoming the installation guide, command reference, or architecture specification.",
      "Beam's job is to make design handoff inspectable. It does not replace Figma, does not write application code for you, and does not require Beam Cloud for the local Free workflow.",
      "Read this page first if you need the mental model. Move to Install Beam when you are ready to run commands.",
    ],
    bullets: [
      "Not an IDE, code generator, or design editor.",
      "Built for local Free usage first.",
      "CLI and MCP use the same core engine.",
    ],
    blocks: [
      {
        id: "what-beam-does",
        title: "What Beam Does",
        body: [
          "Beam sits between Figma and a coding agent. The user gives Beam a Figma frame URL, and Beam converts that design into a local bundle of implementation context: a simplified frame model, rendered reference image, assets, token hints, warnings, confidence signals, and file paths the agent can open.",
          "The important shift is that the agent no longer starts from a screenshot alone. A screenshot shows pixels, but it does not explain node names, text layers, component intent, exportable assets, omitted fields, cache state, or whether the design data is reliable enough to build from. Beam makes those things explicit.",
        ],
        bullets: [
          "Use Beam when a developer or agent needs to implement a Figma frame.",
          "Use Beam when a team wants local, inspectable design handoff artifacts.",
          "Use Beam when visual comparison needs a repeatable Figma reference.",
          "Do not use Beam as a Figma editor, browser IDE, or framework-specific code generator.",
        ],
      },
      {
        id: "documentation-order",
        title: "Recommended Reading Order",
        body: [
          "The documentation is ordered by how a user adopts Beam. Start with the product model, then install the local tool, then inspect a design, then connect an agent, and only then read deeper reference pages.",
          "Each page owns one stage of the journey. If a later page needs setup knowledge, it links back conceptually instead of repeating all setup instructions.",
        ],
        bullets: [
          "Introduction: understand what Beam is and when to use it.",
          "Install Beam: prepare Node.js, install the package, authenticate, and run doctor.",
          "First Inspect: run the first Figma frame inspection and read the output.",
          "Agent Setup: connect Beam to an MCP-compatible coding agent.",
          "CLI Commands: use the command index when you need exact syntax.",
          "Architecture and Business: understand system boundaries, security, rate limits, and editions.",
        ],
      },
      {
        id: "core-objects",
