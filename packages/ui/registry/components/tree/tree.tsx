/* Anatomy from Sesama UI (MIT), keyboard from the WAI-ARIA tree view pattern; rows styled as Beam's sidebar rows (see CREDITS.md). */
"use client";

import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Icon } from "../../../icons/icon";
import { cn } from "../../../lib/cn";
import { Spinner } from "../spinner/spinner";

type TreeItem = {
  id: string;
  label: string;
  icon?: IconSvgElement;
  children?: TreeItem[];
  /** Children are on their way: an open item shows a loading row. */
  loading?: boolean;
  /** Buttons at the end of the row, shown on hover and on the selected row. */
  actions?: React.ReactNode;
};

type VisibleNode = { item: TreeItem; level: number; parentId?: string };

const isFolder = (item: TreeItem) => item.children !== undefined || item.loading === true;

/** The rows a person can see, in order: every top item, and the children of each open folder. */
function visibleNodes(items: readonly TreeItem[], expanded: ReadonlySet<string>, level = 1, parentId?: string): VisibleNode[] {
  return items.flatMap((item) => [
    { item, level, parentId },
    ...(expanded.has(item.id) && item.children ? visibleNodes(item.children, expanded, level + 1, item.id) : []),
  ]);
}

type TreeMove = { focus?: string; expand?: string; collapse?: string };

/** What a key does on the focused row (WAI-ARIA tree view): arrows, Home, End and type-ahead on the first letter. */
function treeKeyMove(nodes: readonly VisibleNode[], currentId: string, key: string, expanded: ReadonlySet<string>): TreeMove | null {
  const index = nodes.findIndex((n) => n.item.id === currentId);
  if (index < 0) return null;
  const node = nodes[index]!;
  const at = (i: number) => nodes[i]?.item.id;
  switch (key) {
    case "ArrowDown":
      return index < nodes.length - 1 ? { focus: at(index + 1) } : null;
    case "ArrowUp":
      return index > 0 ? { focus: at(index - 1) } : null;
    case "Home":
      return { focus: at(0) };
    case "End":
      return { focus: at(nodes.length - 1) };
    case "ArrowRight":
      if (!isFolder(node.item)) return null;
      if (!expanded.has(node.item.id)) return { expand: node.item.id };
      return node.item.children?.length ? { focus: node.item.children[0]!.id } : null;
    case "ArrowLeft":
      if (isFolder(node.item) && expanded.has(node.item.id)) return { collapse: node.item.id };
      return node.parentId ? { focus: node.parentId } : null;
  }
  if (key.length !== 1 || !/\S/.test(key)) return null;
  const letter = key.toLowerCase();
  for (let step = 1; step <= nodes.length; step++) {
    const candidate = nodes[(index + step) % nodes.length]!;
    if (candidate.item.label.toLowerCase().startsWith(letter)) return { focus: candidate.item.id };
  }
  return null;
}

// Rows are the sidebar's menu rows at Toggle's heights: 24, 28 or 36px, 6px radius, quiet text that brightens.
const treeRowVariants = cva(
  "flex w-full min-w-0 cursor-pointer items-center rounded-(--radius-md) text-text-2 select-none hover:bg-secondary hover:text-text-1 data-[selected]:bg-secondary data-[selected]:text-text-1 data-[selected]:font-medium",
  {
    variants: {
      size: {
        sm: "h-6 gap-1.5 pe-1.5 ps-[calc(var(--level)*14px+6px)] text-[13px] leading-[16px]",
        md: "h-7 gap-1.5 pe-2 ps-[calc(var(--level)*16px+8px)] text-[14px] leading-[20px]",
        lg: "h-(--control-md) gap-2 pe-2 ps-[calc(var(--level)*16px+8px)] text-[14px] leading-[20px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

type TreeProps = Omit<React.ComponentProps<"ul">, "children"> &
  VariantProps<typeof treeRowVariants> & {
    items: TreeItem[];
    selected?: string;
    defaultSelected?: string;
    onSelectedChange?: (id: string) => void;
    expanded?: string[];
    defaultExpanded?: string[];
    onExpandedChange?: (ids: string[]) => void;
  };

function Tree({ items, selected: selectedProp, defaultSelected, onSelectedChange, expanded: expandedProp, defaultExpanded = [], onExpandedChange, size, className, ...props }: TreeProps) {
  const [innerSelected, setInnerSelected] = React.useState(defaultSelected);
  const [innerExpanded, setInnerExpanded] = React.useState(defaultExpanded);
  const selected = selectedProp ?? innerSelected;
  const expanded = React.useMemo(() => new Set(expandedProp ?? innerExpanded), [expandedProp, innerExpanded]);
  const nodes = visibleNodes(items, expanded);
  const [focused, setFocused] = React.useState<string>();
  const tabStop = nodes.some((n) => n.item.id === focused) ? focused : nodes.some((n) => n.item.id === selected) ? selected : nodes[0]?.item.id;
  const refs = React.useRef(new Map<string, HTMLLIElement>());

  const setExpanded = (id: string, open: boolean) => {
    const next = new Set(expanded);
    if (open) next.add(id);
    else next.delete(id);
    if (expandedProp === undefined) setInnerExpanded([...next]);
    onExpandedChange?.([...next]);
  };
  const select = (item: TreeItem) => {
    if (selectedProp === undefined) setInnerSelected(item.id);
    onSelectedChange?.(item.id);
    if (isFolder(item)) setExpanded(item.id, !expanded.has(item.id));
  };
  const focus = (id: string) => {
    setFocused(id);
    refs.current.get(id)?.focus();
  };

  const render = (list: TreeItem[], level: number): React.ReactNode =>
    list.map((item, index) => {
      const open = expanded.has(item.id);
      const folder = isFolder(item);
      return (
        <li
          key={item.id}
          ref={(el) => {
            if (el) refs.current.set(item.id, el);
            else refs.current.delete(item.id);
          }}
          role="treeitem"
          data-slot="tree-item"
          aria-level={level}
          aria-setsize={list.length}
          aria-posinset={index + 1}
          aria-expanded={folder ? open : undefined}
          aria-selected={item.id === selected}
          tabIndex={item.id === tabStop ? 0 : -1}
          className="group/tree-item outline-none focus-visible:[&>[data-slot=tree-row]]:shadow-(--focus-ring)"
          onFocus={(event) => event.target === event.currentTarget && setFocused(item.id)}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              return select(item);
            }
            const move = treeKeyMove(nodes, item.id, event.key, expanded);
            if (!move) return;
            event.preventDefault();
            if (move.expand) setExpanded(move.expand, true);
            if (move.collapse) setExpanded(move.collapse, false);
            if (move.focus) focus(move.focus);
          }}
        >
          <div
            data-slot="tree-row"
            data-selected={item.id === selected || undefined}
            style={{ "--level": level - 1 } as React.CSSProperties}
