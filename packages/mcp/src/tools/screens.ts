import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { BeamToolContext } from "./index.js";
import { jsonContent, toolError } from "./responses.js";

export const DEFAULT_REGISTRY = "https://beam.dev/r";

type RegistryFile = { target: string; content: string };
type RegistryItem = { name: string; title: string; description: string; dependencies?: string[]; files: RegistryFile[] };

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} answered ${res.status}`);
  return res.json();
}

/**
 * Finished screens (dashboards, sidebar layouts, login, sign up) built from Beam UI. Agents read them before
 * building a page of that kind, so it starts from a proven layout instead of one made up on the spot.
 */
export function registerScreenTools(server: McpServer, context: BeamToolContext): void {
  const registry = () => (context.registryUrl ?? process.env.BEAM_REGISTRY_URL ?? DEFAULT_REGISTRY).replace(/\/$/, "");
  const get = context.fetchJson ?? fetchJson;

  server.tool(
    "screens_list",
    "List Beam's finished screens: dashboards, an agent workspace, app sidebar layouts, login and sign-up pages, with what each is for and the components it uses. Call this before building any of those pages and start from the closest one.",
    { group: z.enum(["Dashboard", "Agent", "Sidebar", "Login", "Sign up"]).optional() },
    async ({ group }) => {
      try {
        const index = (await get(`${registry()}/screens/index.json`)) as { group: string }[];
        return jsonContent(group ? index.filter((s) => s.group === group) : index);
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.tool(
    "screens_get",
    "Get one Beam screen's full source, file by file, as it reads once installed, plus the command that installs it. Use it to build from the screen or to adapt it to the user's data.",
    { id: z.string().regex(/^[a-z0-9-]+$/).describe("A screen id from screens_list, for example sidebar-icon-collapse") },
    async ({ id }) => {
      try {
        const item = (await get(`${registry()}/screens/${id}.json`)) as RegistryItem;
        return jsonContent({
          id: item.name,
          title: item.title,
          summary: item.description,
          install: `npx usebeam add screens/${item.name}`,
          dependencies: item.dependencies ?? [],
          files: item.files.map((f) => ({ path: f.target, content: f.content })),
        });
      } catch (error) {
        return toolError(error);
      }
    },
  );
}
