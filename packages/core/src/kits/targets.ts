import { access } from "node:fs/promises";
import { join } from "node:path";

export type AgentId = "claude-code" | "codex" | "cursor";

/** Where each agent reads project skills (checked against the Claude Code, Codex and Cursor docs). */
export const SKILL_DIRS: Record<AgentId, string> = {
  "claude-code": join(".claude", "skills"),
  codex: join(".agents", "skills"),
  cursor: join(".cursor", "skills"),
};

const MARKERS: Record<AgentId, string[]> = {
  "claude-code": [".claude", "CLAUDE.md", ".mcp.json"],
  codex: [".agents", "AGENTS.md", ".codex"],
  cursor: [".cursor", ".cursorrules"],
};

const present = (path: string) => access(path).then(() => true, () => false);

export async function detectAgents(cwd: string): Promise<AgentId[]> {
  const found: AgentId[] = [];
  for (const agent of Object.keys(MARKERS) as AgentId[]) {
    for (const marker of MARKERS[agent]) {
      if (await present(join(cwd, marker))) {
        found.push(agent);
        break;
      }
    }
  }
  return found;
}

/**
 * Skill folders to write for the chosen agents. Cursor also loads .claude/skills, so when Claude Code is
 * targeted too, Cursor gets no copy of its own and never lists the same skill twice.
 * With no agent detected, Beam writes the two shared locations so any agent opened later finds the skill.
 */
export function skillTargets(agents: AgentId[]): string[] {
  const chosen = agents.length > 0 ? agents : (["claude-code", "codex"] as AgentId[]);
  const dirs = chosen
    .filter((agent) => !(agent === "cursor" && chosen.includes("claude-code")))
    .map((agent) => SKILL_DIRS[agent]);
  return [...new Set(dirs)];
}
