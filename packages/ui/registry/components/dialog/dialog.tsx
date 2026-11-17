/* Based on shadcn/ui (MIT). Design reference: Stripe, measured (Pictures/beam/references/stripe/ui). */
"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { Dialog as DialogPrimitive } from "radix-ui";
import type * as React from "react";
import { Icon } from "../../../icons/icon";
import { cn } from "../../../lib/cn";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;
const DialogPortal = DialogPrimitive.Portal;

// Checkout chooser: a 20% black overlay; the panel is --card, 12px radius, 40px padding, a 0 40px 100px shadow.
function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return <DialogPrimitive.Overlay data-slot="dialog-overlay" className={cn("fixed inset-0 z-50 bg-(--overlay)", className)} {...props} />;
}

function DialogContent({ className, children, showClose = true, ...props }: React.ComponentProps<typeof DialogPrimitive.Content> & { showClose?: boolean }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-6 rounded-(--radius-xl) bg-card p-10 text-text-1 shadow-(--shadow-dialog) outline-none",
          className,
        )}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close className="absolute end-4 top-4 grid size-7 place-items-center rounded-(--radius-md) text-text-3 outline-none hover:bg-secondary hover:text-text-1 focus-visible:shadow-(--focus-ring)">
            <Icon icon={Cancel01Icon} size="sm" label="Close" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-1", className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-footer" className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />;
}

// Checkout chooser title: 24/700/32px.
function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn("text-[24px] leading-[32px] font-bold text-text-1", className)} {...props} />;
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description data-slot="dialog-description" className={cn("text-[16px] leading-[24px] text-text-2", className)} {...props} />;
}

export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger };
