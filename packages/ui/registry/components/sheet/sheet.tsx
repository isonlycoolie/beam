/* Based on shadcn/ui (MIT). Sizes, type and shadows are measured references (see CREDITS.md). */
"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { Dialog as SheetPrimitive } from "radix-ui";
import type * as React from "react";
import { Icon } from "../../../icons/icon";
import { cn } from "../../../lib/cn";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;

const SIDES = {
  right: "inset-y-0 end-0 h-full w-[min(420px,100%)] border-s",
  left: "inset-y-0 start-0 h-full w-[min(420px,100%)] border-e",
  top: "inset-x-0 top-0 border-b",
  bottom: "inset-x-0 bottom-0 border-t",
};

// The Dialog's measured parts: the 20% overlay and the dialog shadow; a --border edge and 24px padding.
function SheetContent({ className, children, side = "right", ...props }: React.ComponentProps<typeof SheetPrimitive.Content> & { side?: keyof typeof SIDES }) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-(--overlay)" />
      <SheetPrimitive.Content data-slot="sheet-content" className={cn("fixed z-50 flex flex-col gap-4 border-border bg-card p-6 shadow-(--shadow-dialog) outline-none", SIDES[side], className)} {...props}>
        {children}
        <SheetPrimitive.Close className="absolute end-4 top-4 grid size-7 place-items-center rounded-(--radius-md) text-text-3 outline-none hover:bg-secondary hover:text-text-1 focus-visible:shadow-(--focus-ring)">
          <Icon icon={Cancel01Icon} size="sm" label="Close" />
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-header" className={cn("flex flex-col gap-1 pe-8", className)} {...props} />;
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-footer" className={cn("mt-auto flex flex-col gap-2", className)} {...props} />;
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return <SheetPrimitive.Title data-slot="sheet-title" className={cn("text-[16px] leading-[24px] font-semibold text-text-1", className)} {...props} />;
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return <SheetPrimitive.Description data-slot="sheet-description" className={cn("text-[14px] leading-[20px] text-text-2", className)} {...props} />;
}

export { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger };
