import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AgentRun, AgentRunStep } from "../registry/components/agent-run/agent-run";
import { Composer, ComposerFooter, ComposerInput, ComposerSubmit, isSubmitKey } from "../registry/components/composer/composer";
import { DatePicker, formatDateValue } from "../registry/components/date-picker/date-picker";
import { addTags, TagInput } from "../registry/components/tag-input/tag-input";
import { ToolCall, ToolCallError } from "../registry/components/tool-call/tool-call";
import { Tree, treeKeyMove, visibleNodes, type TreeItem } from "../registry/components/tree/tree";

const ITEMS: TreeItem[] = [
  { id: "web", label: "Website", children: [{ id: "overview", label: "Overview" }, { id: "pricing", label: "Pricing" }] },
  { id: "app", label: "Mobile app", children: [{ id: "onboarding", label: "Onboarding" }] },
  { id: "notes", label: "Notes" },
];

describe("Composer", () => {
  it("sends on Enter, not on Shift+Enter or while an input method composes", () => {
    expect(isSubmitKey({ key: "Enter", shiftKey: false, isComposing: false })).toBe(true);
    expect(isSubmitKey({ key: "Enter", shiftKey: true, isComposing: false })).toBe(false);
    expect(isSubmitKey({ key: "Enter", shiftKey: false, isComposing: true })).toBe(false);
    expect(isSubmitKey({ key: "a", shiftKey: false, isComposing: false })).toBe(false);
  });

  const composer = (props: Record<string, unknown>) =>
    renderToStaticMarkup(h(Composer, props, h(ComposerInput), h(ComposerFooter, null, h(ComposerSubmit))));

  it("disables Send while empty and enables it with text or files", () => {
    expect(composer({})).toMatch(/<button(?=[^>]*type="submit")(?=[^>]*disabled="")/);
    expect(composer({ defaultValue: "Hi" })).not.toMatch(/<button(?=[^>]*type="submit")(?=[^>]*disabled="")/);
    expect(composer({ hasAttachments: true })).not.toMatch(/disabled=""/);
  });

  it("turns Send into Stop while running, with a growing field capped at 240px", () => {
    const html = composer({ status: "running", defaultValue: "Hi" });
    expect(html).toContain('aria-label="Stop"');
    expect(html).not.toContain('aria-label="Send"');
    expect(html).toContain("max-h-[min(240px,35dvh)]");
    expect(html).toContain("min-h-14");
  });
});

describe("Tag Input", () => {
  it("adds trimmed tags, skips blanks and repeats, and splits pasted lists", () => {
    expect(addTags(["Design"], " Research ")).toEqual(["Design", "Research"]);
    expect(addTags(["Design"], "design")).toEqual(["Design"]);
    expect(addTags([], "a, b\nc,, ")).toEqual(["a", "b", "c"]);
  });

  it("stops at the limit", () => {
    expect(addTags(["a"], "b,c,d", 2)).toEqual(["a", "b"]);
  });

  it("names each remove button after its tag", () => {
    const html = renderToStaticMarkup(h(TagInput, { label: "Tags", defaultValue: ["Design"] }));
    expect(html).toContain('aria-label="Remove Design"');
    expect(html).toContain('role="group"');
  });
});

describe("Tree", () => {
  it("lists only the rows inside open folders", () => {
    expect(visibleNodes(ITEMS, new Set()).map((n) => n.item.id)).toEqual(["web", "app", "notes"]);
    expect(visibleNodes(ITEMS, new Set(["web"])).map((n) => [n.item.id, n.level])).toEqual([
      ["web", 1], ["overview", 2], ["pricing", 2], ["app", 1], ["notes", 1],
    ]);
  });

  it("moves with the WAI-ARIA keys", () => {
    const open = new Set(["web"]);
    const nodes = visibleNodes(ITEMS, open);
    expect(treeKeyMove(nodes, "web", "ArrowDown", open)).toEqual({ focus: "overview" });
    expect(treeKeyMove(nodes, "overview", "ArrowUp", open)).toEqual({ focus: "web" });
    expect(treeKeyMove(nodes, "pricing", "Home", open)).toEqual({ focus: "web" });
    expect(treeKeyMove(nodes, "web", "End", open)).toEqual({ focus: "notes" });
    expect(treeKeyMove(nodes, "web", "ArrowRight", open)).toEqual({ focus: "overview" });
    expect(treeKeyMove(nodes, "app", "ArrowRight", open)).toEqual({ expand: "app" });
    expect(treeKeyMove(nodes, "web", "ArrowLeft", open)).toEqual({ collapse: "web" });
    expect(treeKeyMove(nodes, "pricing", "ArrowLeft", open)).toEqual({ focus: "web" });
    expect(treeKeyMove(nodes, "notes", "ArrowRight", open)).toBeNull();
  });

  it("jumps to the next row starting with a typed letter, wrapping round", () => {
    const open = new Set(["web"]);
    const nodes = visibleNodes(ITEMS, open);
    expect(treeKeyMove(nodes, "web", "p", open)).toEqual({ focus: "pricing" });
    expect(treeKeyMove(nodes, "notes", "w", open)).toEqual({ focus: "web" });
  });

  it("renders a treeview with one tab stop and the aria states", () => {
    const html = renderToStaticMarkup(h(Tree, { "aria-label": "Projects", items: ITEMS, defaultExpanded: ["web"], defaultSelected: "pricing" }));
    expect(html).toContain('role="tree"');
    expect(html.match(/tabindex="0"/g)).toHaveLength(1);
    expect(html).toMatch(/aria-expanded="true"[^>]*aria-selected="false"/);
    expect(html).toMatch(/aria-selected="true" tabindex="0"/);
    expect(html).toContain('role="group"');
  });
});

describe("Date Picker", () => {
  it("formats single dates and ranges, with the year once", () => {
    expect(formatDateValue(new Date(2026, 10, 18), "en-US")).toBe("Nov 18, 2026");
    expect(formatDateValue({ from: new Date(2026, 10, 3), to: new Date(2026, 10, 18) }, "en-US")).toBe("Nov 3 – Nov 18, 2026");
    expect(formatDateValue({ from: new Date(2025, 11, 30), to: new Date(2026, 0, 2) }, "en-US")).toBe("Dec 30, 2025 – Jan 2, 2026");
    expect(formatDateValue(undefined)).toBe("");
  });

  it("shows the placeholder, and a clear button once a date is set", () => {
    expect(renderToStaticMarkup(h(DatePicker, {}))).toContain("Pick a date");
    expect(renderToStaticMarkup(h(DatePicker, { defaultValue: new Date(2026, 10, 18) }))).toContain('aria-label="Clear date"');
  });
});

describe("Tool Call and Agent Run", () => {
  it("say their state in words and as a label", () => {
    const html = renderToStaticMarkup(h(ToolCall, { name: "Write file", state: "failed", duration: "0.4s" }, h(ToolCallError, { value: "Denied" })));
    expect(html).toContain("Failed · 0.4s");
    expect(html).toContain('data-status="failed"');
    const run = renderToStaticMarkup(h(AgentRun, { title: "Review", state: "running", defaultOpen: true }, h(AgentRunStep, { state: "completed" }, "Read")));
    expect(run).toContain('role="status"');
    expect(run).toContain('aria-label="Completed"');
  });
});
