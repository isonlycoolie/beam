/* Based on shadcn/ui (MIT). Sizes, type and shadows are measured references (see CREDITS.md). */
import type * as React from "react";
import { cn } from "../../../lib/cn";

// The card menu item, flat: a 48px round icon tile, a 16/600/24px title, a 14/20px description 4px
// below, 16px gap; the outline variant keeps its 1px --input border and 10px radius.
function Item({ className, variant = "default", ...props }: React.ComponentProps<"div"> & { variant?: "default" | "outline" }) {
  return <div data-slot="item" className={cn("flex items-center gap-4 p-4", variant === "outline" && "rounded-(--radius-lg) border border-input", className)} {...props} />;
}

function ItemMedia({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="item-media" className={cn("grid size-12 shrink-0 place-items-center rounded-full bg-secondary text-text-3", className)} {...props} />;
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-content" className={cn("flex min-w-0 flex-1 flex-col gap-1", className)} {...props} />;
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-title" className={cn("text-[16px] leading-[24px] font-semibold text-text-1", className)} {...props} />;
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="item-description" className={cn("text-[14px] leading-[20px] text-text-2", className)} {...props} />;
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-actions" className={cn("flex shrink-0 items-center gap-2", className)} {...props} />;
}

export { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle };
