/* Based on shadcn/ui (MIT). Design reference: Stripe, measured (Pictures/beam/references/stripe/ui). */
"use client";

import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { Accordion as AccordionPrimitive } from "radix-ui";
import type * as React from "react";
import { Icon } from "../../../icons/icon";
import { cn } from "../../../lib/cn";

const Accordion = AccordionPrimitive.Root;

function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item data-slot="accordion-item" className={cn("border-b border-border", className)} {...props} />;
}

// Triggers use the Docs group header: 14/500/20px with a 12px chevron at the end; rows are 16px tall in padding.
function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 items-center justify-between gap-4 py-4 text-start text-[14px] leading-[20px] font-medium text-text-1 outline-none hover:text-link focus-visible:shadow-(--focus-ring) [&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        <Icon icon={ArrowDown01Icon} size="sm" className="size-3 transition-transform duration-(--dur-fast)" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content data-slot="accordion-content" className="overflow-hidden text-[14px] leading-[20px] text-text-2" {...props}>
      <div className={cn("pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
