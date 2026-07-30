export type CommandDoc = {
  command: string;
  slug: string;
  summary: string;
  usage: string;
  notes: string[];
  sequence?: string[];
  expectedOutput?: string;
  files?: string[];
  nextStep?: string;
  recovery?: string[];
};

export const commandDocs: CommandDoc[] = [
  {
    command: "beam login",
    slug: "beam-login",
    summary:
      "Connect Beam to Figma by storing a user-local credential for the Free workflow.",
    usage: "beam login --token <figma-token>\nbeam login\nbeam whoami",
    notes: [
      "Use this command before `beam inspect`, `beam export`, or any MCP tool that needs live Figma access. The MVP login flow uses a Figma personal access token so Beam can prove the local design pipeline without requiring an OAuth app setup.",
      "Credentials are stored in the user Beam directory under the local profile. They are not written into the project, not added to `.beam/config.json`, and not included in snapshots, debug bundles, package files, or MCP responses.",
      "`beam login --token <figma-token>` is useful for controlled setup and automation. Interactive `beam login` is better for normal use because it keeps the token out of shell history when the terminal supports secure input.",
      "`beam whoami` verifies that Beam can read the local auth state without printing the token value. It should report useful account or credential status while keeping secrets hidden.",
    ],
    sequence: [
      "Create a Figma personal access token from Figma account settings.",
      "Run `beam login --token <figma-token>` for scripted setup or `beam login` for interactive setup.",
      "Run `beam whoami` to confirm Beam can read the saved credential.",
      "Run `beam doctor` before inspecting a design.",
    ],
    expectedOutput:
      "Beam should confirm that credentials were saved, then `beam whoami` should report an authenticated local credential without printing the token.",
    files: ["~/.beam/credentials.json"],
    nextStep: "Use `beam doctor` to validate the full local environment.",
    recovery: [
      "If the token is rejected, create a new Figma token and confirm the file is shared with that Figma account.",
      "If the credential file cannot be written, check permissions on the user Beam directory.",
      "If a token appears in shell history, rotate it in Figma and log in again interactively.",
    ],
  },
  {
    command: "beam init",
    slug: "beam-init",
    summary:
      "Create or print MCP configuration so coding agents can start Beam locally.",
    usage: "beam init --print\nbeam init --client codex\nbeam init --json",
    notes: [
      "`beam init` is the bridge between Beam and coding agents. It configures an MCP client to launch `beam mcp`, which exposes the same core design context, asset, variable, and compare behavior as the CLI.",
      "`--print` is the safest first command. It prints the manual MCP configuration and does not modify any client files, which is useful for review, copy-paste setup, or unsupported clients.",
      "`--client codex` targets a supported adapter. Config writes must preserve unrelated settings, validate the final JSON, create a backup before changing files, and show the exact path that changed.",
      "Unsupported clients should never fail silently. Beam should print the manual MCP config and explain where the user can place it in their agent settings.",
    ],
    sequence: [
      "Run `beam init --print` first and review the generated MCP configuration.",
      "If the client is supported, run `beam init --client codex` or the matching client adapter.",
      "Restart the coding agent so it can discover the Beam MCP server.",
      "Ask the agent to use Beam with a Figma frame URL.",
    ],
    expectedOutput:
      "`--print` should show a JSON block with a `beam` MCP server whose command is `beam` and whose args are `[\"mcp\"]`. Client-specific setup should report the config path it updated.",
    files: [
      "Agent MCP configuration file",
      "Backup of the client config when Beam writes automatically",
    ],
    nextStep: "Run `beam mcp` manually if you need to verify server startup outside the agent.",
    recovery: [
      "If the client is unsupported, place the printed JSON in the client's manual MCP configuration area.",
      "If the agent cannot find Beam, confirm the global `beam` command is available in the same shell environment the agent uses.",
      "If automatic config fails, use `beam init --print` and apply the configuration manually.",
    ],
  },
  {
    command: "beam doctor",
    slug: "beam-doctor",
    summary:
      "Check whether the local machine is ready to use Beam safely and reliably.",
    usage: "beam doctor\nbeam doctor --json",
    notes: [
      "`beam doctor` is the first support command. Run it after install, after login, and whenever inspect, export, compare, or MCP startup behaves unexpectedly.",
      "Doctor checks the Node.js version, Beam version, local Beam directories, credential presence, cache access, project readiness, and basic configuration state. It should avoid hidden network work unless the command clearly documents it.",
      "Human output should be direct and actionable. If auth is missing, the next step is `beam login`. If a Figma call is blocked, Beam should explain access, scope, or rate-limit state instead of returning a generic failure.",
      "`--json` is intended for scripts, CI checks, and support tooling. It should use structured statuses that are stable enough for automation.",
    ],
    sequence: [
      "Run `beam doctor` immediately after installation.",
      "Run it again after `beam login`.",
      "Run it inside the project where you plan to inspect, export, or compare designs.",
      "Use `beam doctor --json` when capturing diagnostics for automation.",
    ],
    expectedOutput:
      "A healthy run should show passed checks for Beam version, Node.js version, local directories, credential state, cache access, and project readiness.",
    files: ["Reads local Beam config and cache directories", "Does not create design snapshots"],
    nextStep: "If doctor passes, run `beam inspect <figma-url>`.",
    recovery: [
      "If auth is missing, run `beam login`.",
      "If Node is too old, install Node.js 22.12 or newer.",
      "If cache directories are not writable, fix filesystem permissions before using inspect or export.",
    ],
  },
  {
    command: "beam inspect",
    slug: "beam-inspect",
    summary:
      "Turn a Figma frame into structured implementation context for humans and agents.",
    usage:
      "beam inspect <figma-url>\nbeam inspect <figma-url> --json\nbeam inspect <figma-url> --best-effort",
    notes: [
      "`beam inspect` is the main Free product workflow. It parses the Figma URL, resolves local auth, fetches frame data through the core Figma client, reads or writes cache entries, creates a snapshot, simplifies the node tree, and returns an implementation brief.",
      "The default context mode is `standard`, which is designed for agent handoff. It emphasizes layout intent, text, components, tokens, assets, rendered references, warnings, omitted fields, confidence, and build readiness.",
      "Evidence review is enabled by default. Beam should distinguish what came from the Figma node tree, what came from rendered images, what came from local snapshots, what was inferred, and what is missing.",
      "`--best-effort` must be explicit. If evidence is incomplete, Beam should say whether the agent can proceed, what evidence would improve confidence, and whether the missing data blocks implementation.",
    ],
    sequence: [
      "Copy the Figma frame URL, not just the file URL, when possible.",
      "Run `beam inspect <figma-url>` for human-readable context.",
      "Run `beam inspect <figma-url> --json` when an agent, script, or test needs stable structured output.",
      "Review build readiness, warnings, estimated tokens, and clarification requests before implementing.",
    ],
    expectedOutput:
      "Beam should return source metadata, snapshot id, frame summary, layout guidance, text and token notes, asset references, warnings, confidence score, build readiness, and local image paths when available.",
    files: [
      ".beam/cache/raw/<file-key>/<node-id>.json",
      ".beam/cache/briefs/<snapshot-id>.json",
      ".beam/cache/images/<snapshot-id>.png",
    ],
    nextStep: "Use the brief to build the UI, then run `beam compare <figma-url> <local-url>`.",
    recovery: [
      "If the URL is invalid, copy a Figma design or file URL that includes a valid file key and node id.",
      "If access is missing, share the Figma file with the account used by the saved token.",
      "If Figma is rate limited, use the newest valid snapshot or retry after the reported interval.",
    ],
  },
  {
    command: "beam export",
    slug: "beam-export",
    summary:
      "Write local visual references, exportable assets, and the canonical asset manifest.",
    usage:
      "beam export <figma-url>\nbeam export <figma-url> --out .beam/assets\nbeam export <figma-url> --json",
    notes: [
      "`beam export` is for local ground truth. It should write rendered frame references, exportable image or vector assets, and a manifest that follows Beam's canonical Asset Manifest Contract.",
      "Exports use the same core pipeline as inspect. The CLI should not duplicate Figma fetching, cache access, snapshot behavior, or asset discovery logic outside Beam Core.",
      "Output paths are local project files. Beam Free should not upload assets, sync customer data, or require a hosted account to complete the export.",
      "`--json` should return stable paths and warnings so agents or scripts can use the exported files without scraping terminal text.",
    ],
    sequence: [
      "Run `beam inspect <figma-url>` first if you want to review the frame and evidence state.",
      "Run `beam export <figma-url>` to write the rendered reference and exportable assets.",
      "Open the asset manifest to see every exported node, output path, format, and scale.",
      "Point the coding agent at the exported files when implementing image-heavy screens.",
    ],
    expectedOutput:
      "Beam should report the snapshot id, exported frame image path, asset count, manifest path, skipped nodes, and warnings for assets that could not be exported.",
    files: [
      ".beam/cache/images/<snapshot-id>.png",
      ".beam/cache/assets/<asset-name>.<format>",
      ".beam/cache/assets/<snapshot-id>.manifest.json",
    ],
    nextStep: "Use the manifest paths in the implementation and compare the local page afterwards.",
    recovery: [
      "If no assets export, confirm the selected frame actually contains exportable images, vectors, or fills.",
      "If an asset is missing, provide the source file manually or ask Beam for a node image.",
      "If output paths are unexpected, pass `--out <directory>` explicitly.",
    ],
  },
  {
    command: "beam compare",
    slug: "beam-compare",
    summary:
      "Compare a local rendered page with Figma visual ground truth using practical image signals.",
    usage:
      "beam compare <figma-url> <local-url>\nbeam compare <figma-url> <local-url> --threshold 0.95\nbeam compare <figma-url> <local-url> --json",
    notes: [
      "`beam compare` helps users verify whether a local implementation is visually close to the Figma reference. It is useful after an agent builds a screen and the local app is running.",
      "The v1 comparator is intentionally pragmatic. It can report screenshot dimensions, pixel differences, dominant mismatch signals, similarity score, local artifact paths, and structured differences.",
      "It does not claim semantic design perfection. Typography meaning, responsive behavior, and component intent still need human or agent review when the visual signal is ambiguous.",
      "Compare artifacts stay local. Results should follow Beam's Compare Result Contract so CLI JSON, MCP responses, and future history features share the same shape.",
    ],
    sequence: [
      "Start the local application that contains the implemented screen.",
      "Confirm the target page loads in a browser, for example `http://localhost:3000/pricing`.",
      "Run `beam compare <figma-url> <local-url>`.",
      "Review the score, dimensions, artifact paths, and differences before iterating.",
    ],
    expectedOutput:
      "Beam should report a compare id, Figma snapshot id, target URL, score, screenshot paths, diff artifact path, and structured differences such as spacing, size, color, or image mismatch signals.",
    files: [
      ".beam/cache/compare/<compare-id>/local.png",
      ".beam/cache/compare/<compare-id>/figma.png",
      ".beam/cache/compare/<compare-id>/diff.png",
      ".beam/cache/compare/<compare-id>/result.json",
    ],
    nextStep: "Fix the largest visual differences, rebuild the app, and run compare again.",
    recovery: [
      "If the local URL is unreachable, start the app dev server and retry.",
      "If screenshots have different dimensions, match the viewport or frame size before trusting the score.",
      "If visual output is ambiguous, use the diff image plus the Beam implementation brief together.",
    ],
  },
  {
    command: "beam snapshots",
    slug: "beam-snapshots",
    summary:
      "List, inspect, and restore local snapshots from previous Beam design fetches.",
    usage:
      "beam snapshots list\nbeam snapshots show <snapshot-id>\nbeam snapshots restore <snapshot-id>",
    notes: [
      "Snapshots make one-shot Figma access durable. After Beam successfully fetches a frame, the snapshot records source metadata, hash, Beam version, mode, timestamps, and paths to raw payloads, briefs, images, and asset manifests.",
      "`beam snapshots list` helps users find prior work without hitting Figma again. `beam snapshots show` explains what data exists, what paths are available, and whether the snapshot can support offline review.",
      "`beam snapshots restore` materializes snapshot artifacts into local cache locations so inspect, evidence review, export, or agent workflows can continue from stored data.",
      "Snapshot commands should not bypass permissions or pretend stale data is fresh. When using older data, Beam should make cache age and evidence confidence visible.",
    ],
    sequence: [
      "Run `beam snapshots list` to see stored design captures.",
      "Run `beam snapshots show <snapshot-id>` to inspect paths, age, source URL, and available artifacts.",
      "Run `beam snapshots restore <snapshot-id>` when you need offline reuse.",
      "Run inspect again only when you need fresh Figma data.",
    ],
    expectedOutput:
      "`list` should show snapshot ids, frame names or source URLs, creation time, mode, and artifact availability. `show` should expose paths without printing secrets.",
    files: [
      ".beam/cache/snapshots/<snapshot-id>.json",
      ".beam/cache/briefs/<snapshot-id>.json",
      ".beam/cache/images/<snapshot-id>.png",
    ],
    nextStep: "Use restored snapshot artifacts with inspect, export, MCP tools, or compare.",
    recovery: [
      "If a snapshot is stale, rerun inspect with live Figma access.",
      "If a snapshot is missing files, restore another snapshot or fetch the frame again.",
      "If the snapshot cannot be trusted, check its source URL, hash, mode, and Beam version.",
    ],
  },
  {
    command: "beam mappings",
    slug: "beam-mappings",
    summary:
      "Connect known Figma components to local code imports for better agent handoff.",
    usage:
      'beam mappings add --figma-component-id 123:456 --figma-name "Button / Primary" --import "@/components/button" --export Button\nbeam mappings list\nbeam mappings remove 123:456',
    notes: [
      "Mappings help Beam explain that a Figma component already has a local code equivalent. This improves implementation guidance without turning Beam into a code generator.",
      "Mappings are project-local and should contain no secrets. They can be committed when they only reference component names, Figma IDs, import paths, and package-safe metadata.",
      "`beam mappings add` records a relationship. `beam mappings list` shows the current registry. `beam mappings remove` deletes a stale or incorrect relationship.",
      "Core output remains framework-agnostic. A mapping can point to React, Vue, Svelte, or another local component style without Beam hardcoding framework behavior.",
    ],
    sequence: [
      "Identify the Figma component id and its readable component name.",
      "Identify the local component import path and exported symbol.",
      "Run `beam mappings add` with those values.",
      "Run `beam mappings list` and confirm the mapping appears before asking an agent to build.",
    ],
    expectedOutput:
      "Beam should confirm the mapping was saved and list the Figma component id, Figma name, import path, export name, and project-local mapping file.",
    files: [".beam/mappings.json"],
    nextStep: "Run `beam inspect <figma-url>` so the brief can mention known local components.",
    recovery: [
      "If the import path changes, remove the old mapping and add the new one.",
      "If an agent uses the wrong component, verify the Figma component id matches the design instance.",
      "If mappings should not be shared, keep `.beam/mappings.json` out of commits.",
    ],
  },
  {
    command: "beam debug bundle",
    slug: "beam-debug-bundle",
    summary:
      "Create a sanitized local support bundle for fetch, cache, simplify, and MCP issues.",
    usage:
      "beam debug bundle\nbeam debug bundle --out .beam/debug\nbeam debug bundle --include-raw",
    notes: [
      "`beam debug bundle` is for support and investigation. It should collect useful local diagnostics such as config without secrets, recent logs, snapshot metadata, MCP config state, environment information, and command outcomes.",
      "Credentials are excluded by default. Tokens must not appear in bundle files, terminal output, logs, errors, or MCP responses.",
      "Raw Figma payloads are customer data. They require explicit opt-in through `--include-raw`, and the command should make that choice visible before producing a bundle.",
      "The bundle helps determine whether an issue came from Figma access, Beam fetching, cache state, simplification, asset export, MCP transport, or visual comparison.",
    ],
    sequence: [
      "Run `beam doctor` first so the obvious setup state is captured separately.",
      "Run `beam debug bundle` to create a redacted support bundle.",
      "Inspect the bundle summary before sharing it.",
      "Use `--include-raw` only when raw Figma payloads are required for debugging.",
    ],
    expectedOutput:
      "Beam should print the bundle path, included diagnostic categories, redaction status, and any files that were intentionally skipped.",
    files: [
      ".beam/debug/<timestamp>/summary.json",
      ".beam/debug/<timestamp>/logs/",
      ".beam/debug/<timestamp>/snapshots/",
    ],
    nextStep: "Use the bundle to isolate whether the issue is auth, Figma access, cache, simplification, MCP, or compare.",
    recovery: [
      "If the bundle includes sensitive design data, delete it and rerun without `--include-raw`.",
      "If logs are missing, reproduce the failing command and create the bundle again.",
      "If the bundle cannot be written, pass `--out <directory>` to a writable location.",
    ],
  },
  {
    command: "beam mcp",
    slug: "beam-mcp",
    summary:
      "Start Beam's MCP server over stdio so coding agents can call Beam tools.",
    usage: "beam mcp",
    notes: [
      "`beam mcp` is normally launched by an MCP-compatible coding agent after `beam init` writes or prints the client configuration.",
      "The server runs over stdio and exposes tools such as `get_design_context`, `get_node_image`, `list_assets`, `download_assets`, `get_file_variables`, and compare capability when available.",
      "MCP tools must call the same Beam Core APIs as the CLI. This keeps human commands and agent tools aligned for Figma fetches, cache behavior, snapshots, assets, evidence, and errors.",
      "Tool responses should be compact, structured, credential-safe, and actionable. If data is missing, rate-limited, or inaccessible, Beam should return warnings and clarification requests rather than guessing silently.",
    ],
    sequence: [
      "Run `beam init --print` and confirm the MCP config points to `beam mcp`.",
      "Start the agent or run `beam mcp` manually for transport verification.",
      "Give the agent a Figma frame URL and ask it to use Beam.",
      "Let the agent request context, images, assets, and compare results through MCP tools.",
    ],
    expectedOutput:
      "When launched by an agent, Beam should expose its MCP tool list and return JSON-safe responses with paths, warnings, confidence, and build readiness. Manual startup should remain quiet unless the transport reports an error.",
    files: ["No project file is required unless tools create cache, assets, snapshots, or compare artifacts"],
    nextStep: "Ask the coding agent to build from a frame and compare the result against Figma.",
    recovery: [
      "If the agent cannot start the server, confirm `beam` is on PATH for the agent process.",
