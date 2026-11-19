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
