import { describe, expect, it } from "vitest";
import { registerBeamTools } from "../src/tools/index.js";

type Handler = (input: Record<string, unknown>) => Promise<{ content: { text: string }[] }>;

function setup(responses: Record<string, unknown>) {
  const tools: Record<string, Handler> = {};
  const urls: string[] = [];
  const server = {
    tool(name: string, _d: string, _s: unknown, handler: Handler) {
      tools[name] = handler;
    },
  };
  registerBeamTools(server as never, {
    cwd: process.cwd(),
    registryUrl: "http://registry.test/r/",
    fetchJson: async (url) => {
      urls.push(url);
      return responses[url];
    },
  });
  return { tools, urls };
}

const read = async (p: Promise<{ content: { text: string }[] }>) => JSON.parse((await p).content[0]!.text);

describe("screen tools", () => {
  it("lists screens from the registry index, filtered by group", async () => {
    const { tools, urls } = setup({
      "http://registry.test/r/screens/index.json": [
        { id: "login-simple", group: "Login" },
        { id: "sidebar-floating", group: "Sidebar" },
      ],
    });
    expect(await read(tools.screens_list!({ group: "Sidebar" }))).toEqual([{ id: "sidebar-floating", group: "Sidebar" }]);
    expect(urls).toEqual(["http://registry.test/r/screens/index.json"]);
  });

  it("returns a screen's installed files and its install command", async () => {
    const { tools } = setup({
      "http://registry.test/r/screens/login-simple.json": {
        name: "login-simple",
        title: "Login · Simple",
        description: "Email and password in one card.",
        dependencies: [],
        files: [{ target: "app/login-simple/page.tsx", content: 'import { Button } from "@/components/ui/button"' }],
      },
    });
    const screen = await read(tools.screens_get!({ id: "login-simple" }));
    expect(screen.install).toBe("npx usebeam add screens/login-simple");
    expect(screen.files[0].path).toBe("app/login-simple/page.tsx");
    expect(screen.files[0].content).not.toContain("@beam/ui");
  });

  it("reports a registry failure as a tool error", async () => {
    const { tools } = setup({});
    const out = await read(tools.screens_get!({ id: "missing" }));
    expect(out.error.code).toBe("BEAM_INTERNAL_ERROR");
  });
});
