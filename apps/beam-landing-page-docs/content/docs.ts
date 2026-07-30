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
        title: "Core Objects",
        body: [
          "Beam documentation uses a few repeated nouns. They appear throughout the product, so this page defines them once before the operational guides begin.",
          "A frame is the Figma surface the user wants to build. A brief is Beam's simplified implementation context. A snapshot is the durable local record of a fetched design. An asset manifest is the index of exported files. A compare result is the visual check between Figma and a local page.",
        ],
        bullets: [
          "Frame: the Figma node Beam targets.",
          "Brief: the implementation summary Beam returns.",
          "Snapshot: a reusable local record of a design fetch.",
          "Asset manifest: a structured list of exported images, vectors, and paths.",
          "Evidence: what Beam knows, inferred, or still needs from the user.",
          "Compare result: local visual fidelity feedback against Figma ground truth.",
        ],
      },
      {
        id: "local-first-boundary",
        title: "Local-First Boundary",
        body: [
          "Beam Free runs locally. Credentials stay in the user's Beam directory, design artifacts are written to local `.beam` paths, and coding agents connect through a local MCP server. Beam Cloud is an optional future control plane for sync, sharing, history, and governance.",
          "This boundary is important because teams need to know which data is local, which data is customer design data, and which future features would require explicit cloud sync.",
        ],
      },
      {
        id: "human-and-agent-surfaces",
        title: "Human And Agent Surfaces",
        body: [
          "Beam has two primary surfaces. Humans use the CLI to log in, inspect, export, compare, list snapshots, maintain mappings, and create debug bundles. Agents use MCP tools to request the same core context without duplicating Figma or cache logic.",
          "The CLI and MCP server are intentionally thin over Beam Core. That keeps behavior consistent whether a developer runs `beam inspect` or an agent calls `get_design_context`.",
        ],
      },
      {
        id: "what-to-read-next",
        title: "What To Read Next",
        body: [
          "If you are setting up Beam for the first time, go to Install Beam next. If Beam is already installed and authenticated, go to First Inspect. If you are connecting Codex or another MCP client, go to Agent Setup after the first CLI workflow succeeds.",
        ],
        bullets: [
          "Next page for new users: Install Beam.",
          "Next page for already-installed users: First Inspect.",
          "Next page for agent users: Agent Setup.",
          "Next page for platform teams: System Architecture.",
        ],
      },
    ],
  },
  {
    id: "quickstart",
    slug: "install-beam",
    kicker: "Get Started",
    title: "Install Beam and verify local readiness.",
    body: "This page covers setup only: runtime requirements, package installation, Figma authentication, and the doctor check that confirms Beam is ready for design work.",
    details: [
      "The public npm package is `usebeam`, and the installed command is `beam`. This keeps the command short while avoiding unavailable npm scopes.",
      "MVP authentication uses a Figma personal access token. OAuth is a later public-v1 direction, but PAT auth keeps the Free product useful while the core design pipeline matures.",
      "After `beam doctor` passes, this page is complete. Move to First Inspect for the first Figma frame run.",
    ],
    bullets: [
      "Credentials stay in the user Beam directory.",
      "Project files should not contain tokens.",
      "Use npx usebeam doctor for local project installs.",
    ],
    code:
      "npm install -g usebeam\nbeam login\nbeam whoami\nbeam doctor",
    sequence: [
      "Install globally for the simplest personal workflow.",
      "Use project-local installation only when a repository needs a pinned Beam version.",
      "Log in before running live Figma commands.",
      "Run doctor after login and inside the project where Beam artifacts will be written later.",
      "Stop here when doctor passes; the next page owns the first Figma inspect workflow.",
    ],
    expectedOutput:
      "`beam whoami` should confirm a saved local credential without printing the token. `beam doctor` should show a usable runtime, credential state, cache access, and project readiness.",
    files: [
      "~/.beam/credentials.json",
      ".beam/cache/",
    ],
    nextStep:
      "Open First Inspect and run `beam inspect <figma-url>` against a single Figma frame.",
    recovery: [
      "If install fails, verify Node.js 22.12 or newer and pnpm/npm availability.",
