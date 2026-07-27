#!/usr/bin/env node

import { Command } from "commander";
import { loginCommand, logoutCommand, whoamiCommand } from "./commands/auth.js";
import { compareCommand } from "./commands/compare.js";
import { doctorCommand } from "./commands/doctor.js";
import { exportCommand } from "./commands/export.js";
import { inspectCommand } from "./commands/inspect.js";
import { initCommand } from "./commands/init.js";
import { mappingsCommand } from "./commands/mappings.js";
import { mcpCommand } from "./commands/mcp.js";
import { settingsCommand } from "./commands/settings.js";
import { snapshotsCommand } from "./commands/snapshots.js";

const program = new Command();

program
  .name("beam")
  .description("Beam design intelligence CLI")
  .version("0.1.0");

program
  .command("login")
  .option("--token <token>", "Figma personal access token")
  .option("--token-stdin", "Read Figma token from stdin")
  .action(async (options: { token?: string; tokenStdin?: boolean }) => {
    await loginCommand(options);
  });

program
  .command("logout")
  .option("--yes", "Confirm credential removal")
  .option("--json", "Print structured JSON output")
  .action(async (options: { yes?: boolean; json?: boolean }) => {
    await logoutCommand(options);
  });

program
  .command("whoami")
  .option("--json", "Print structured JSON output")
  .action(async (options: { json?: boolean }) => {
    await whoamiCommand(options);
  });

program
  .command("doctor")
  .description("Check local Beam setup")
  .option("--json", "Print structured JSON output")
  .action(async (options: { json?: boolean }) => {
    await doctorCommand(options);
  });

program
  .command("inspect")
  .argument("<figma-url>")
  .option("--mode <mode>", "Context mode")
  .option("--raw", "Use raw context mode")
  .option("--refresh", "Bypass cache")
  .option("--json", "Print structured JSON output")
  .action(
    async (
      url: string,
      options: {
        mode?: "summary" | "standard" | "full" | "raw";
        raw?: boolean;
        refresh?: boolean;
        json?: boolean;
      },
    ) => {
      await inspectCommand(url, options);
    },
  );

program
  .command("export")
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
  .option("--client <client>", "MCP client to configure")
  .option("--print", "Print manual MCP config without writing files")
  .option("--json", "Print structured JSON output")
  .action(
    async (options: { client?: string; print?: boolean; json?: boolean }) => {
      await initCommand(options);
    },
  );

program
  .command("mappings")
  .argument("<action>")
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
  .argument("<action>")
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
  .argument("<action>")
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
  .command("mcp")
  .description("Start the Beam MCP server")
  .action(async () => {
    await mcpCommand();
  });

await program.parseAsync(process.argv);
