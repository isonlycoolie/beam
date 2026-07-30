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
