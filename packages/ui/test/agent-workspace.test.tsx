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
