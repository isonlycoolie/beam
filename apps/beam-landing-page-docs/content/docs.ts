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
      "If doctor fails after login, run `beam whoami` to isolate credential state.",
      "If doctor passes but inspect later fails, treat that as a Figma URL, file access, or rate-limit issue rather than an installation issue.",
    ],
  },
  {
    id: "workflow",
    slug: "first-inspect",
    kicker: "Core Workflow",
    title: "From Figma URL to agent-ready context.",
    body: "Beam parses the URL, authenticates locally, fetches Figma data, caches raw responses and images, creates snapshots, simplifies the node tree, and returns implementation guidance.",
    details: [
      "A Figma URL is parsed into file and node identifiers. Beam then resolves local credentials, schedules Figma requests, reads or writes cache entries, and stores snapshot metadata for later reuse.",
      "The simplifier converts noisy Figma JSON into an implementation model that emphasizes layout intent, text, components, tokens, assets, warnings, and omitted fields.",
      "When access is limited or rate limits are reached, Beam prefers the newest valid snapshot and explains what is known, what is inferred, and what evidence the user can provide.",
    ],
    code:
      "beam inspect <figma-url> --json\nbeam snapshots list\nbeam export <figma-url>\nbeam compare <figma-url> http://localhost:3000",
    sequence: [
      "Start with a precise frame URL so Beam can target one buildable surface.",
      "Inspect the frame to create a snapshot and implementation brief.",
      "List snapshots to confirm the design can be reused offline.",
      "Export references and assets when the implementation needs image or vector files.",
      "After building locally, compare the local URL with the Figma reference.",
    ],
    expectedOutput:
      "The sequence should create a traceable chain: source URL, snapshot id, brief path, rendered image path, asset manifest path, compare id, and local diff artifacts.",
    files: [
      ".beam/cache/snapshots/<snapshot-id>.json",
      ".beam/cache/briefs/<snapshot-id>.json",
      ".beam/cache/assets/<snapshot-id>.manifest.json",
      ".beam/cache/compare/<compare-id>/result.json",
    ],
    nextStep:
      "Use the compare result to iterate on spacing, sizing, typography, color, and asset mismatches.",
    recovery: [
      "If Figma fetch fails but a snapshot exists, continue from the snapshot and make cache age visible.",
      "If the local URL does not load, start the app before compare.",
      "If the brief is too large for an agent, request a smaller context mode and export assets separately.",
    ],
  },
  {
    id: "cli",
    slug: "cli-commands",
    kicker: "CLI Guide",
    title: "Human commands stay thin over the core.",
    body: "The CLI gives users a small set of direct commands for authentication, setup, design inspection, asset export, visual comparison, local reuse, diagnostics, and MCP startup.",
    details: [
      "`beam login` stores Figma credentials in the user Beam directory. Tokens are not written into project files or printed back to the terminal.",
      "`beam doctor` checks the local environment before work begins. It validates Node, auth state, Beam directories, cache access, and project readiness.",
      "`beam inspect` turns a Figma frame into implementation context. `beam export` writes visual references and the canonical asset manifest. `beam compare` checks a local page against Figma ground truth.",
      "`beam snapshots` supports offline reuse. `beam mappings` connects known design components to local code. `beam debug bundle` creates sanitized diagnostics without requiring Beam Cloud.",
    ],
    code:
      "beam login\nbeam doctor\nbeam inspect <figma-url>\nbeam export <figma-url>\nbeam compare <figma-url> <local-url>\nbeam snapshots list\nbeam debug bundle",
    sequence: [
      "Use auth commands first: `beam login`, then `beam whoami` if you need to verify identity.",
      "Use readiness commands next: `beam doctor` before live fetches or support debugging.",
      "Use design commands during implementation: `inspect`, `export`, and `compare`.",
      "Use local reuse commands after successful fetches: `snapshots` and `mappings`.",
      "Use support commands last: `debug bundle` when a workflow needs investigation.",
    ],
    expectedOutput:
      "Each command should return a clear success state, a next action, and stable paths or JSON fields when artifacts are created.",
    files: [
      "~/.beam/credentials.json",
      ".beam/cache/",
      ".beam/mappings.json",
      ".beam/debug/",
    ],
    nextStep:
      "Open an individual command page from the command grid for exact usage, output, and recovery guidance.",
    recovery: [
      "If a CLI command fails, rerun it with `--json` when available to capture structured diagnostics.",
      "If a design command fails, separate auth issues from Figma access issues with `beam doctor` and `beam whoami`.",
      "If output paths are unclear, use command JSON output instead of scraping terminal text.",
    ],
  },
  {
    id: "mcp",
    slug: "agent-setup",
    kicker: "Agent Integration",
    title: "MCP exposes the same Beam core to agents.",
    body: "Agents call Beam tools for design context, node images, assets, variables, and visual comparison without duplicating Figma or cache behavior.",
    details: [
      "`beam init --print` emits MCP configuration that starts `beam mcp`. Supported clients can then launch Beam as a local MCP server.",
      "The intended workflow is simple: the user gives an agent a Figma URL, the agent requests design context, downloads assets when needed, builds the UI, and asks Beam for comparison signals.",
      "Beam does not assume a framework. It returns structured evidence, warnings, paths, and contracts so Codex, Claude Code, Cursor, Copilot, and other MCP clients can decide how to build.",
    ],
    code: '{\n  "mcpServers": {\n    "beam": {\n      "command": "beam",\n      "args": ["mcp"]\n    }\n  }\n}',
    sequence: [
      "Run `beam login` so MCP tools can access Figma when live fetches are needed.",
      "Run `beam init --print` and review the MCP configuration.",
      "Add the config to the coding agent or run a supported `beam init --client <name>` adapter.",
      "Restart the agent so it loads the Beam server.",
      "Ask the agent to build from a Figma frame URL using Beam.",
    ],
    expectedOutput:
      "The agent should discover Beam tools, call `get_design_context`, optionally request node images and assets, build the UI, and call compare when a local URL is available.",
    files: [
      "Agent MCP settings file",
      ".beam/cache/briefs/<snapshot-id>.json",
      ".beam/cache/images/<snapshot-id>.png",
      ".beam/cache/assets/<snapshot-id>.manifest.json",
    ],
    nextStep:
      "Use the MCP tool grid to understand what the agent can request from Beam during implementation.",
    recovery: [
      "If the agent does not list Beam tools, verify its MCP config and restart the agent.",
      "If Beam works in terminal but not inside the agent, check PATH differences between shell and agent process.",
      "If an MCP response says data is missing, follow the clarification request instead of asking the agent to guess.",
    ],
  },
  {
    id: "capabilities",
    slug: "capabilities",
    kicker: "Capabilities",
    title: "The Free product is durable and honest.",
    body: "Beam focuses on Figma URL parsing, local credentials, rate-limit aware fetching, local cache, snapshots, simplification, token extraction, asset export, evidence scoring, visual compare, mappings, debug bundles, and local logs.",
    details: [
      "Free does not mean vague. Beam Free is the local product: inspect designs, export references, keep snapshots, explain missing evidence, and serve agents through MCP.",
      "The evidence and confidence engine is designed for real Figma constraints. It distinguishes known Figma data, rendered-image inference, local snapshots, missing assets, user notes, and confirmation requests.",
      "Visual compare is intentionally pragmatic in v1. It reports dimensions, pixel differences, dominant mismatches, and artifact paths rather than pretending to understand every semantic UI detail.",
    ],
    sequence: [
      "Use Figma access capabilities first: URL parsing, auth, scheduler, and cache.",
      "Use interpretation capabilities next: simplifier, tokens, assets, warnings, evidence, and confidence.",
      "Use persistence capabilities after that: snapshots, manifests, mappings, logs, and debug bundles.",
      "Use verification capabilities last: rendered references and visual compare.",
    ],
    expectedOutput:
      "Every capability should either produce structured context, a local artifact path, a stable JSON contract, or an actionable warning. Silent guessing is a product bug.",
    files: [
      ".beam/cache/raw/",
      ".beam/cache/briefs/",
      ".beam/cache/assets/",
      ".beam/mappings.json",
      ".beam/debug/",
    ],
    nextStep:
      "When documenting a new capability, include the command, expected output, files touched, and how it fails.",
    recovery: [
      "If a capability depends on Figma and Figma is unavailable, check whether a snapshot can satisfy the workflow.",
      "If a capability produces uncertain output, inspect the evidence confidence section.",
      "If a capability touches project files, make sure it does not write credentials or hidden cloud state.",
    ],
  },
  {
    id: "business",
    slug: "open-source-vs-cloud",
    kicker: "Business Architecture",
    title: "Open source core, optional cloud control plane.",
    body: "Free stays local. Pro, Team, and Enterprise add sync, history, sharing, governance, policy, audit, and optional self-hosting without bypassing Figma permissions or rate limits.",
    details: [
      "Free is for individual local usage: CLI, MCP, local cache, snapshots, asset export, evidence review, compare, mappings, logs, and debug bundles.",
      "Pro is planned for personal continuity: cloud snapshot sync, saved implementation briefs, compare history, and convenience across machines.",
      "Team is planned for shared handoff: shared snapshots, shared mappings, CI compare, team logs, and reusable design context across product teams.",
      "Enterprise is planned for governance: SSO, RBAC, retention policy, audit logs, private artifact storage, self-hosting, and organization-managed MCP templates.",
      "Paid plans improve workflow scale and reliability. They do not bypass Figma permissions, seat access, upstream rate limits, or file sharing rules.",
    ],
    sequence: [
      "Start with Free for local CLI, MCP, cache, snapshots, export, compare, and debug bundles.",
      "Add Pro only when personal sync and cross-machine continuity matter.",
      "Add Team when multiple developers need shared snapshots, mappings, and CI compare.",
      "Add Enterprise when platform teams need SSO, RBAC, audit, retention, private storage, or self-hosting.",
    ],
    expectedOutput:
      "The product boundary should be obvious: Free produces local artifacts; paid editions synchronize, share, govern, or retain those artifacts with explicit user or organization control.",
    files: [
      "Free: local `.beam/` artifacts",
      "Pro/Team: planned cloud-synced Beam artifacts",
      "Enterprise: planned private or self-hosted artifact storage",
    ],
    nextStep:
      "Use the edition table to decide which business workflow the user is trying to solve before describing cloud features.",
    recovery: [
      "If a user expects paid Beam to bypass Figma rate limits, explain the hard boundary and offer caching or team proxy options.",
      "If a team needs shared context, start with snapshot sharing rather than raw token sharing.",
      "If an enterprise needs control, keep credentials, retention, and audit requirements separate from the local core.",
    ],
  },
  {
    id: "architecture",
    slug: "system-architecture",
    kicker: "System Architecture",
    title: "One core engine, multiple interfaces.",
    body: "The CLI serves humans, the MCP server serves agents, and both call Beam Core for parsing, Figma access, caching, snapshots, simplification, assets, compare, and observability.",
    details: [
      "Beam Core owns product intelligence: URL parsing, auth resolution, Figma client calls, cache management, snapshot storage, simplification, token planning, assets, compare, and logs.",
      "No direct Figma calls should live outside the core Figma client. No CLI-specific or agent-specific behavior should leak into the core engine.",
      "Cloud services are optional extensions. The Free core must stay useful without hosted accounts, dashboards, billing, or enterprise infrastructure.",
    ],
    sequence: [
      "A human or agent sends a Figma URL to the CLI or MCP server.",
      "Beam Core parses the URL and resolves local credentials.",
      "The Figma client fetches node data and rendered images through scheduled, cache-aware requests.",
      "The snapshot store records source metadata and artifact paths.",
      "The simplifier produces the implementation brief, token summary, asset list, evidence, and warnings.",
      "CLI or MCP returns the same core result in human or machine-friendly form.",
    ],
    expectedOutput:
      "A healthy architecture keeps all Figma, cache, snapshot, simplification, asset, compare, and evidence behavior inside Beam Core, with thin CLI and MCP interfaces on top.",
    files: [
      "packages/core/src/",
      "packages/cli/src/",
      "packages/mcp/src/",
      ".beam/cache/",
    ],
    nextStep:
      "Use the contracts page when adding or changing a field shared by CLI, MCP, cache, or cloud.",
    recovery: [
      "If CLI and MCP behavior differ, move duplicated behavior back into Beam Core.",
      "If Figma calls appear outside the core client, consolidate them before expanding features.",
      "If cloud becomes required for Free workflows, restore the local-first boundary.",
    ],
  },
  {
    id: "security",
    slug: "security",
    kicker: "Security Model",
    title: "Design data is customer data. Tokens are secrets.",
    body: "Beam keeps credentials local by default, avoids writing secrets to project files, makes cloud sync explicit, and leaves enterprise controls for paid deployment boundaries.",
    details: [
      "Local credentials live in the user Beam directory and must never be committed. Tokens should not appear in logs, error messages, project config, debug bundles, or MCP responses.",
      "Design data, rendered exports, assets, implementation briefs, and compare results are customer data. Beam Free keeps them local unless a future paid sync feature is explicitly enabled.",
      "Enterprise controls are future product capabilities, not hidden defaults in the Free product. The local open-source workflow must remain transparent and cloud-optional.",
    ],
    sequence: [
      "Store Figma credentials only in the user Beam directory.",
      "Write project artifacts only under local `.beam/` paths unless the user chooses another output directory.",
      "Redact secrets from terminal output, logs, debug bundles, JSON responses, and MCP responses.",
      "Make cloud sync explicit when paid features exist.",
      "Use enterprise controls for organization policy, not hidden behavior in Free.",
    ],
    expectedOutput:
      "Security-sensitive commands should report what they changed without printing tokens. Debug and support outputs should identify redaction status and any customer-data opt-ins.",
    files: [
      "~/.beam/credentials.json",
      ".beam/cache/",
      ".beam/debug/",
      "Agent MCP settings file",
    ],
    nextStep:
      "Before sharing any debug bundle or snapshot, review whether it contains customer design data.",
    recovery: [
      "If a token is printed or committed, rotate it immediately in Figma.",
      "If a debug bundle includes raw payloads accidentally, delete it and regenerate without raw data.",
      "If cloud sync is enabled later, provide deletion, retention, and export controls.",
    ],
  },
  {
    id: "reliability",
    slug: "rate-limits",
    kicker: "Rate Limits And Reliability",
    title: "Beam respects Figma limits and permissions.",
    body: "Caching, snapshots, request deduplication, retry metadata, and cached fallback behavior reduce repeated Figma calls without claiming unlimited upstream access.",
    details: [
      "When Figma returns a rate limit, Beam should report the endpoint, retry timing when available, whether cached data exists, and whether the agent can proceed from a snapshot.",
      "If a cached snapshot is good enough, Beam can continue with a build-readiness review. If the snapshot is incomplete, Beam asks for specific user evidence instead of guessing silently.",
      "Draft files, private files, missing node access, and limited token scopes are product states Beam must explain clearly rather than masking them as generic request failures.",
    ],
    sequence: [
      "Make one deliberate Figma fetch instead of repeated blind retries.",
      "Cache raw node data and rendered images from successful fetches.",
      "On a `429`, read retry metadata and report when Beam can retry.",
      "Offer cached snapshot fallback when available.",
      "If cached evidence is insufficient, ask for the smallest useful user evidence.",
    ],
    expectedOutput:
      "A rate-limit response should name the endpoint, retry timing when available, cache fallback status, snapshot age, and whether the build is ready, degraded, or blocked.",
    files: [
      ".beam/cache/raw/",
      ".beam/cache/images/",
      ".beam/cache/snapshots/",
      ".beam/cache/logs/",
    ],
    nextStep:
      "Proceed from cache when confidence is high enough, or wait for Figma retry timing when fresh data is required.",
    recovery: [
      "If the file is private, fix sharing rather than retrying.",
      "If the token lacks access, log in with an account that can open the file.",
      "If repeated fetches cause limits, reuse snapshots and avoid unnecessary refreshes.",
    ],
  },
  {
    id: "contracts",
    slug: "contracts",
    kicker: "Reference Contracts",
    title: "Stable JSON shapes connect CLI, MCP, cache, and cloud.",
    body: "Design context, snapshots, asset manifests, compare results, warnings, and evidence models use explicit schema versions and deterministic fields.",
    details: [
      "Design context responses include source metadata, snapshot summary, implementation brief, image path, warnings, estimated token count, confidence, and build readiness.",
      "Snapshots persist source, hash, Beam version, mode, timestamps, and paths to raw payloads, briefs, images, and asset manifests.",
      "Asset manifests list exported assets with node IDs, names, formats, scale, output paths, and source URLs. Compare results report score, target URL, differences, and artifact paths.",
    ],
    code:
      '{\n  "schemaVersion": "1.0",\n  "source": {\n    "fileKey": "abc",\n    "nodeId": "1:2",\n    "url": "https://www.figma.com/file/..."\n  },\n  "snapshot": {\n    "id": "snapshot_01J...",\n    "fromCache": true\n  },\n  "brief": {\n    "frame": {},\n    "layout": {},\n    "components": [],\n    "tokens": {},\n    "assets": [],\n    "implementationNotes": []\n  },\n  "warnings": [],\n  "estimatedTokens": 18000\n}',
    sequence: [
      "Add `schemaVersion` to every shared object.",
      "Keep CLI JSON, MCP responses, local cache files, and cloud sync shapes aligned.",
      "Add warnings for omitted or uncertain data instead of dropping fields silently.",
      "Preserve local file paths so agents can open exported images, assets, manifests, and compare artifacts.",
    ],
    expectedOutput:
      "A contract response should be deterministic, parseable, credential-safe, and stable enough for agents and scripts to consume without scraping human text.",
    files: [
      ".beam/cache/briefs/<snapshot-id>.json",
      ".beam/cache/snapshots/<snapshot-id>.json",
      ".beam/cache/assets/<snapshot-id>.manifest.json",
      ".beam/cache/compare/<compare-id>/result.json",
    ],
    nextStep:
      "When a field changes, update CLI output, MCP output, tests, and docs together.",
    recovery: [
      "If a script breaks after a contract change, verify `schemaVersion` and migration behavior.",
      "If a field contains a secret, remove it from the contract and rotate affected credentials.",
      "If agents need more detail, add explicit fields rather than embedding prose-only instructions.",
    ],
  },
];

export const commandSections: DocSection[] = commandDocs.map((command) => ({
  id: command.slug,
  slug: command.slug,
  kicker: "CLI Command",
  title: command.command,
  body: command.summary,
  details: command.notes,
  code: command.usage,
  sequence: command.sequence,
  expectedOutput: command.expectedOutput,
  files: command.files,
  nextStep: command.nextStep,
  recovery: command.recovery,
}));

export const allSections = [...sections, ...commandSections];

export const sectionBySlug = new Map(
  allSections.map((section) => [section.slug, section]),
);

export function getSectionBySlug(slug?: string) {
  const defaultSection = sections[0];
  if (!defaultSection) {
    throw new Error("No documentation sections are configured.");
  }

  if (!slug) {
    return defaultSection;
  }

  return sectionBySlug.get(slug) ?? defaultSection;
}
