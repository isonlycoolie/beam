/* Based on shadcn/ui (MIT). Sizes, type and shadows are measured references (see CREDITS.md). */
"use client";
import { GlassBackdrop } from "../liquid-glass/liquid-glass";

import { cva, type VariantProps } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "../../../lib/cn";

const Tabs = TabsPrimitive.Root;

// underline: settings tabs (equal width, 32px, 14/600, 8px icon gap; 12px under them, a 1px rule, and a
// 2px --link bar on the rule under the active one).
// segmented: integration picker (28px boxes, 4px radius, 14px; the chosen one gets a 2px --primary ring).
const listVariants = cva("inline-flex items-center", {
  variants: {
    variant: {
      underline: "w-full border-b border-border pb-3",
      segmented: "gap-2",
    },
  },
  defaultVariants: { variant: "underline" },
});

const triggerVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap outline-none focus-visible:shadow-(--focus-ring) disabled:opacity-50",
  {
    variants: {
      variant: {
        underline:
          "relative h-8 flex-1 text-[14px] [line-height:normal] font-semibold text-text-3 hover:text-text-1 data-[state=active]:text-link after:absolute after:inset-x-0 after:-bottom-[13px] after:h-0.5 data-[state=active]:after:bg-link",
        segmented:
          "h-7 rounded-[4px] bg-card px-3 text-[14px] text-text-2 shadow-[0_0_0_1px_var(--border)] hover:text-text-1 data-[state=active]:text-text-1 data-[state=active]:shadow-[0_0_0_2px_var(--primary)]",
      },
    },
    defaultVariants: { variant: "underline" },
  },
);

function TabsList({ className, variant, ...props }: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof listVariants>) {
  return (
    <TabsPrimitive.List data-slot="tabs-list" data-variant={variant ?? "underline"} className={cn(listVariants({ variant }), className)} {...props}>
      <GlassBackdrop />
      {props.children}
    </TabsPrimitive.List>
  );
}

function TabsTrigger({ className, variant, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger> & VariantProps<typeof triggerVariants>) {
  return <TabsPrimitive.Trigger data-slot="tabs-trigger" className={cn(triggerVariants({ variant }), className)} {...props} />;
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn("pt-4 outline-none", className)} {...props} />;
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
