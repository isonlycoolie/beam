/* Based on shadcn/ui (MIT). Design reference: Stripe, measured (Pictures/beam/references/stripe/ui). */
"use client";

import { ArrowRight01Icon, CircleIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import type * as React from "react";
import { Icon } from "../../../icons/icon";
import { cn } from "../../../lib/cn";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
// Surface measured from the Start building menu (--popover, 1px --input, 6px radius, the menu shadow). Rows are
// composed from measured parts: 14/20px text, 6px radius, --secondary when focused.
const surface = "z-50 rounded-(--radius-md) border border-input bg-popover text-popover-foreground shadow-(--shadow-3) min-w-48 overflow-hidden p-1";
const item = "relative flex cursor-default select-none items-center gap-2 rounded-(--radius-md) px-2 py-1.5 text-[14px] leading-[20px] text-text-1 outline-none focus:bg-secondary data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:shrink-0";

function DropdownMenuContent({ className, sideOffset = 4, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content data-slot="dropdown-menu-content" sideOffset={sideOffset} className={cn(surface, className)} {...props} />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuItem({ className, inset, variant = "default", ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & { inset?: boolean; variant?: "default" | "destructive" }) {
  return <DropdownMenuPrimitive.Item data-slot="dropdown-menu-item" data-variant={variant} className={cn(item, inset && "ps-8", variant === "destructive" && "text-danger focus:bg-danger-soft", className)} {...props} />;
}

function DropdownMenuCheckboxItem({ className, children, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem data-slot="dropdown-menu-checkbox-item" className={cn(item, "ps-8", className)} {...props}>
      <span className="absolute start-2 flex size-4 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Icon icon={Tick02Icon} size="sm" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioItem({ className, children, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem data-slot="dropdown-menu-radio-item" className={cn(item, "ps-8", className)} {...props}>
      <span className="absolute start-2 flex size-4 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Icon icon={CircleIcon} size="sm" className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({ className, inset, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }) {
  return <DropdownMenuPrimitive.Label data-slot="dropdown-menu-label" className={cn("px-2 py-1.5 text-[12px] leading-[16px] font-medium text-text-3", inset && "ps-8", className)} {...props} />;
}
function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return <DropdownMenuPrimitive.Separator data-slot="dropdown-menu-separator" className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />;
}
function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="dropdown-menu-shortcut" className={cn("ms-auto text-[12px] tracking-wide text-text-3", className)} {...props} />;
}

function DropdownMenuSubTrigger({ className, inset, children, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & { inset?: boolean }) {
  return (
    <DropdownMenuPrimitive.SubTrigger data-slot="dropdown-menu-sub-trigger" className={cn(item, "data-[state=open]:bg-secondary", inset && "ps-8", className)} {...props}>
      {children}
      <Icon icon={ArrowRight01Icon} size="sm" className="ms-auto" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return <DropdownMenuPrimitive.SubContent data-slot="dropdown-menu-sub-content" className={cn(surface, className)} {...props} />;
}

// The Start building item: 1px --input border, 10px radius, 16px padding and gap, a 48px round icon tile in
// --secondary, a 16/600/24px title and a 14/20px description 4px below.
function DropdownMenuCardItem({ className, icon, title, description, ...props }: Omit<React.ComponentProps<typeof DropdownMenuPrimitive.Item>, "title"> & { icon: React.ReactNode; title: string; description: string }) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-card-item"
      className={cn("flex cursor-default items-center gap-4 rounded-(--radius-lg) border border-input p-4 outline-none focus:bg-surface-2", className)}
      {...props}
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary text-text-3">{icon}</span>
      <span className="flex flex-col gap-1">
        <span className="text-[16px] leading-[24px] font-semibold text-text-1">{title}</span>
        <span className="text-[14px] leading-[20px] text-text-2">{description}</span>
      </span>
    </DropdownMenuPrimitive.Item>
  );
}

export { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuCardItem, DropdownMenuTrigger };
