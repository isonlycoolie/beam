/* Based on shadcn/ui (MIT). Sizes, type and shadows are measured references (see CREDITS.md). */
"use client";

import { ArrowRight01Icon, CircleIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { ContextMenu as ContextMenuPrimitive } from "radix-ui";
import type * as React from "react";
import { Icon } from "../../../icons/icon";
import { cn } from "../../../lib/cn";

const ContextMenu = ContextMenuPrimitive.Root;
const ContextMenuGroup = ContextMenuPrimitive.Group;
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;
const ContextMenuSub = ContextMenuPrimitive.Sub;
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

// Measured menu surface (--popover, 1px --input, 6px radius, the menu shadow). Rows are
// composed from measured parts: 14/20px text, 6px radius, --secondary when focused.
const surface = "z-50 rounded-(--radius-md) border border-input bg-popover text-popover-foreground shadow-(--shadow-3) min-w-48 overflow-hidden p-1";
const item = "relative flex cursor-default select-none items-center gap-2 rounded-(--radius-md) px-2 py-1.5 text-[14px] leading-[20px] text-text-1 outline-none focus:bg-secondary data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:shrink-0";

function ContextMenuContent({ className, sideOffset = 4, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content data-slot="context-menu-content" sideOffset={sideOffset} className={cn(surface, className)} {...props} />
    </ContextMenuPrimitive.Portal>
  );
}

function ContextMenuItem({ className, inset, variant = "default", ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Item> & { inset?: boolean; variant?: "default" | "destructive" }) {
  return <ContextMenuPrimitive.Item data-slot="context-menu-item" data-variant={variant} className={cn(item, inset && "ps-8", variant === "destructive" && "text-danger focus:bg-danger-soft", className)} {...props} />;
}

function ContextMenuCheckboxItem({ className, children, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
  return (
    <ContextMenuPrimitive.CheckboxItem data-slot="context-menu-checkbox-item" className={cn(item, "ps-8", className)} {...props}>
      <span className="absolute start-2 flex size-4 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <Icon icon={Tick02Icon} size="sm" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

function ContextMenuRadioItem({ className, children, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
  return (
    <ContextMenuPrimitive.RadioItem data-slot="context-menu-radio-item" className={cn(item, "ps-8", className)} {...props}>
      <span className="absolute start-2 flex size-4 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <Icon icon={CircleIcon} size="sm" className="size-2 fill-current" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

function ContextMenuLabel({ className, inset, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Label> & { inset?: boolean }) {
  return <ContextMenuPrimitive.Label data-slot="context-menu-label" className={cn("px-2 py-1.5 text-[12px] leading-[16px] font-medium text-text-3", inset && "ps-8", className)} {...props} />;
}

function ContextMenuSeparator({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return <ContextMenuPrimitive.Separator data-slot="context-menu-separator" className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />;
}

function ContextMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="context-menu-shortcut" className={cn("ms-auto text-[12px] tracking-wide text-text-3", className)} {...props} />;
}

function ContextMenuSubTrigger({ className, inset, children, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & { inset?: boolean }) {
  return (
    <ContextMenuPrimitive.SubTrigger data-slot="context-menu-sub-trigger" className={cn(item, "data-[state=open]:bg-secondary", inset && "ps-8", className)} {...props}>
      {children}
      <Icon icon={ArrowRight01Icon} size="sm" className="ms-auto" />
    </ContextMenuPrimitive.SubTrigger>
  );
}

function ContextMenuSubContent({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return <ContextMenuPrimitive.SubContent data-slot="context-menu-sub-content" className={cn(surface, className)} {...props} />;
}

export { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuLabel, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger };
