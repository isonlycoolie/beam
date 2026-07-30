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
