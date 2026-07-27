#!/usr/bin/env node

import { Command } from "commander";
import { compareCommand } from "./commands/compare.js";
import { doctorCommand } from "./commands/doctor.js";
import { exportCommand } from "./commands/export.js";
import { inspectCommand } from "./commands/inspect.js";
import { initCommand } from "./commands/init.js";
import { mcpCommand } from "./commands/mcp.js";

const program = new Command();

program
  .name("beam")
  .description("Beam design intelligence CLI")
  .version("0.1.0");

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
  .command("mcp")
  .description("Start the Beam MCP server")
  .action(async () => {
    await mcpCommand();
  });

await program.parseAsync(process.argv);
