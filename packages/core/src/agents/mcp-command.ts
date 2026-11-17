import { access } from "node:fs/promises";

/** npx keeps Beam install-free. Native Windows needs cmd /c to launch npx as an MCP stdio server. */
export function beamServerCommand(platform: NodeJS.Platform = process.platform) {
  const npx = ["npx", "-y", "usebeam", "mcp"];
  return platform === "win32"
    ? { command: "cmd", args: ["/c", ...npx] }
    : { command: npx[0]!, args: npx.slice(1) };
}

export async function exists(path: string): Promise<boolean> {
  return access(path).then(() => true, () => false);
}
