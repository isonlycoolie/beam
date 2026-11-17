/* Based on shadcn/ui (MIT). Sizes, type and shadows are measured references (see CREDITS.md). */
"use client";

import { ArrowDown01Icon, ArrowUp01Icon, Tick02Icon, UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import { Select as SelectPrimitive } from "radix-ui";
import type * as React from "react";
import { Icon } from "../../../icons/icon";
import { cn } from "../../../lib/cn";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

// Compact select: 34px, 1px --input border, 6px radius, one 1px shadow, 4/8px padding, 14/500/16px,
// the up-down chevron right after the value.
function SelectTrigger({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex h-[34px] w-fit items-center justify-between gap-0 whitespace-nowrap rounded-(--radius-md) border border-input bg-card px-2 py-1",
        "text-[14px] leading-[16px] font-medium text-text-1 shadow-(--shadow-control) outline-none",
        "focus-visible:shadow-(--focus-ring) data-[placeholder]:text-text-3 disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-danger *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <Icon icon={UnfoldMoreIcon} size="sm" className="text-text-1" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

// The list sits on the measured popover surface: 6px radius, 1px --input border, the three-layer menu shadow.
function SelectContent({ className, children, position = "popper", ...props }: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        className={cn(
          "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-hidden rounded-(--radius-md) border border-input bg-popover text-popover-foreground shadow-(--shadow-3)",
          position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="flex items-center justify-center py-1">
          <Icon icon={ArrowUp01Icon} size="sm" />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className={cn("p-1", position === "popper" && "w-full min-w-(--radix-select-trigger-width)")}>{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex items-center justify-center py-1">
          <Icon icon={ArrowDown01Icon} size="sm" />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return <SelectPrimitive.Label data-slot="select-label" className={cn("px-2 py-1.5 text-[12px] leading-[16px] font-medium text-text-3", className)} {...props} />;
}

function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center gap-2 rounded-(--radius-md) py-1.5 ps-2 pe-8 text-[14px] leading-[20px] text-text-1 outline-none",
        "focus:bg-secondary data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute end-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Icon icon={Tick02Icon} size="sm" className="text-primary" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return <SelectPrimitive.Separator data-slot="select-separator" className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />;
}

export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue };
