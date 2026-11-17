#!/usr/bin/env node

import type { AgentId } from "@beam/core";
import { Command } from "commander";
import { loginCommand, logoutCommand, whoamiCommand } from "./commands/auth.js";
import { cloneCommand } from "./commands/clone.js";
import { compareCommand } from "./commands/compare.js";
import { debugCommand } from "./commands/debug.js";
import { doctorCommand } from "./commands/doctor.js";
import { evidenceCommand } from "./commands/evidence.js";
import { exportCommand } from "./commands/export.js";
import { figmaImportCommand } from "./commands/figma.js";
import { inspectCommand } from "./commands/inspect.js";
import { addCommand, listCommand, removeCommand, updateCommand } from "./commands/kits.js";
import { initCommand } from "./commands/init.js";
import { mappingsCommand } from "./commands/mappings.js";
import { mcpCommand } from "./commands/mcp.js";
import { settingsCommand } from "./commands/settings.js";
import { setupCommand } from "./commands/setup.js";
import { snapshotsCommand } from "./commands/snapshots.js";
import { verifyCommand } from "./commands/verify.js";
import { formatError } from "./terminal.js";
import { BEAM_VERSION } from "./version.js";

const program = new Command();

program
  .name("beam")
  .description("Design tools for coding agents: Figma context, visual checks and more")
  .version(BEAM_VERSION);

program
  .command("add")
  .description("Add Beam tools to this project as agent skills: clone, figma, craft, glass, verify")
  .argument("<tools...>", "One or more tool names")
  .option("--agent <agent...>", "Only these agents: claude-code, codex, cursor")
  .option("--force", "Overwrite components you already have")
  .action(async (tools: string[], options: { agent?: AgentId[]; force?: boolean }) => {
    await addCommand(tools, options);
  });

program
  .command("list")
  .description("Show every Beam tool and which ones this project has")
  .option("--json", "Print structured JSON output")
  .action(async (options: { json?: boolean }) => {
    await listCommand(options);
  });

program
  .command("remove")
  .description("Remove a Beam tool's skills from this project")
  .argument("<tool>")
  .action(async (tool: string) => {
    await removeCommand(tool);
  });

program
  .command("update")
  .description("Refresh installed Beam tools to this Beam version")
  .action(async () => {
    await updateCommand();
  });

program
  .command("clone")
  .description("Capture a live page (measured styles, real fonts and images) so an agent can rebuild it exactly")
  .argument("<url>", "The page to clone, for example https://example.com/pricing")
  .option("--breakpoints <widths>", "Comma-separated widths to capture", "1440,768,390")
  .option("--json", "Print a JSON summary")
  .action(async (url: string, options: { breakpoints?: string; json?: boolean }) => {
    await cloneCommand(url, options);
  });

const figma = program
  .command("figma")
  .description("Work with exports from the Beam Figma plugin (no token, any Figma plan)");

figma
  .command("import")
  .description("Unpack a .beam.json export into a brief, renders, images, SVGs and variables")
  .argument("<file>", "The .beam.json file the plugin saved")
  .option("--json", "Print a JSON summary")
  .action(async (file: string, options: { json?: boolean }) => {
    await figmaImportCommand(file, options);
  });

program
  .command("verify")
  .description("Prove a build matches its source: pixels per section plus exact element values")
  .requiredOption("--reference <url|png>", "The source: a live URL or a PNG of the design")
  .requiredOption("--target <url>", "Your build, for example http://localhost:3000")
  .option("--breakpoints <widths>", "Comma-separated widths for URL references", "1440,768,390")
  .option("--threshold <score>", "Minimum score every section must reach", "0.98")
  .option("--pixels-only", "Skip the element check and compare pixels only")
  .option("--sections <numbers>", "Only judge these sections, 1-based, for example 1,2 while building top-down")
  .option("--json", "Print the full report as JSON")
  .action(async (options) => {
    await verifyCommand(options);
  });

program
  .command("login")
  .description("Save a Figma personal access token on this machine")
  .option("--token <token>", "Figma personal access token")
  .option("--token-stdin", "Read Figma token from stdin")
  .action(async (options: { token?: string; tokenStdin?: boolean }) => {
    await loginCommand(options);
  });

program
  .command("logout")
  .description("Remove the saved Figma token")
  .option("--yes", "Confirm credential removal")
  .option("--json", "Print structured JSON output")
  .action(async (options: { yes?: boolean; json?: boolean }) => {
    await logoutCommand(options);
  });

program
  .command("whoami")
  .description("Show which Figma token Beam is using")
  .option("--json", "Print structured JSON output")
  .action(async (options: { json?: boolean }) => {
    await whoamiCommand(options);
  });

program
  .command("debug")
  .description("Write a debug bundle to share when reporting a problem")
  .argument("<action>", "bundle")
  .option("--out <path>", "Debug bundle output directory")
  .option("--include-raw", "Record explicit raw payload inclusion")
  .option("--json", "Print structured JSON output")
  .action(
    async (
      action: string,
      options: { out?: string; includeRaw?: boolean; json?: boolean },
    ) => {
      await debugCommand(action, options);
    },
  );

program
  .command("doctor")
  .description("Check local Beam setup")
  .option("--json", "Print structured JSON output")
  .action(async (options: { json?: boolean }) => {
    await doctorCommand(options);
  });

program
  .command("inspect")
  .description("Turn a Figma frame into implementation context for your agent")
  .argument("<figma-url>")
  .option("--mode <mode>", "Context mode")
  .option("--raw", "Use raw context mode")
  .option("--refresh", "Bypass cache")
  .option("--review", "Include evidence review")
  .option("--best-effort", "Proceed with partial evidence")
  .option("--json", "Print structured JSON output")
  .action(
    async (
      url: string,
      options: {
        mode?: "summary" | "standard" | "full" | "raw";
        raw?: boolean;
        refresh?: boolean;
        review?: boolean;
        bestEffort?: boolean;
        json?: boolean;
      },
    ) => {
      await inspectCommand(url, options);
    },
  );

program
  .command("evidence")
  .description("List or add evidence that a build matches its design")
  .argument("<action>", "list or add")
  .argument("<snapshot-id>")
  .option("--image <path>", "Add screenshot evidence")
  .option("--asset <path>", "Add source asset evidence")
  .option("--reference <path>", "Add reference image evidence")
  .option("--note <text>", "Add note evidence")
  .option("--confirm <text>", "Add confirmation evidence")
  .option("--label <label>", "Evidence label")
  .option("--json", "Print structured JSON output")
  .action(
    async (
      action: string,
      snapshotId: string,
      options: {
        image?: string;
        asset?: string;
        reference?: string;
        note?: string;
        confirm?: string;
        label?: string;
        json?: boolean;
      },
    ) => {
      await evidenceCommand(action, snapshotId, options);
    },
  );

program
  .command("export")
  .description("Export rendered images and assets from a Figma frame")
  .argument("<figma-url>")
  .option("--out <path>", "Output directory")
  .option("--scale <scale>", "Image scale")
  .option("--refresh", "Bypass cache")
  .option("--json", "Print structured JSON output")
  .action(
    async (
      url: string,
      options: {
        out?: string;
        scale?: string;
        refresh?: boolean;
        json?: boolean;
      },
    ) => {
      await exportCommand(url, options);
    },
  );

program
  .command("compare")
  .description("Compare a running page with a Figma frame, pixel by pixel")
  .argument("<figma-url>")
  .argument("<local-url>")
  .option("--threshold <threshold>", "Minimum passing score")
  .option("--out <path>", "Output directory")
  .option("--refresh", "Bypass cache")
  .option("--json", "Print structured JSON output")
  .action(
    async (
      figmaUrl: string,
      localUrl: string,
      options: {
        threshold?: string;
        out?: string;
        refresh?: boolean;
        json?: boolean;
      },
    ) => {
      await compareCommand(figmaUrl, localUrl, options);
    },
  );

program
  .command("init")
  .description("Register the Beam MCP server with Claude Code, Cursor or Codex")
  .option("--client <client>", "Only configure this client: claude-code, cursor or codex")
  .option("--print", "Print manual MCP config without writing files")
  .option("--json", "Print structured JSON output")
  .action(
    async (options: { client?: string; print?: boolean; json?: boolean }) => {
      await initCommand(options);
    },
  );

program
  .command("mappings")
  .description("Link Figma components to components in your code")
  .argument("<action>", "list, add or remove")
  .option("--figma-component-id <id>", "Figma component id")
  .option("--figma-name <name>", "Figma component name")
  .option("--import <path>", "Code import path")
  .option("--export <name>", "Code export name")
  .option("--notes <notes>", "Mapping notes")
  .option("--json", "Print structured JSON output")
  .action(
    async (
      action: string,
      options: {
        figmaComponentId?: string;
        figmaName?: string;
        import?: string;
        export?: string;
        notes?: string;
        json?: boolean;
      },
    ) => {
      await mappingsCommand(action, options);
    },
  );

program
  .command("snapshots")
  .description("List, show or restore saved Figma snapshots")
  .argument("<action>", "list, show or restore")
  .argument("[snapshot-id]")
  .option("--out <path>", "Restore output directory")
  .option("--json", "Print structured JSON output")
  .action(
    async (
      action: string,
      snapshotId: string | undefined,
      options: { out?: string; json?: boolean },
    ) => {
      await snapshotsCommand(action, snapshotId, options);
    },
  );

program
  .command("settings")
  .description("Read and change Beam settings for this project")
  .argument("<action>", "list, get, set or unset")
  .argument("[key]")
  .argument("[value]")
  .option("--json", "Print structured JSON output")
  .action(
    async (
      action: string,
      key: string | undefined,
      value: string | undefined,
      options: { json?: boolean },
    ) => {
      await settingsCommand(action, key, value, options);
    },
  );

program
  .command("setup")
  .description("Install optional runtime pieces, for example the screenshot browser")
  .argument("<target>", "What to set up: browser")
  .action(async (target: string) => {
    await setupCommand(target);
  });

program
  .command("mcp")
  .description("Start the Beam MCP server")
  .action(async () => {
    await mcpCommand();
  });

try {
  await program.parseAsync(process.argv);
} catch (error) {
  const { text, exitCode } = formatError(error, { debug: Boolean(process.env.BEAM_DEBUG) });
  console.error(text);
  process.exitCode = exitCode;
}
