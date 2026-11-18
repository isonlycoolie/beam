/* Based on shadcn/ui (MIT). Sizes, type and shadows are measured references (see CREDITS.md). */
import { GlassBackdrop } from "../liquid-glass/liquid-glass";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../../../lib/cn";

// default: settings panel (1px --border, 8px radius, a 1px + 2/5px shadow).
// muted: info card (--surface-2 fill, 1px --border, 8px radius). elevated: chooser card (12px, no border).
const cardVariants = cva("flex flex-col text-card-foreground", {
  variants: {
    variant: {
      default: "rounded-(--radius-card) border border-border bg-card shadow-(--shadow-card)",
      muted: "rounded-(--radius-card) border border-border bg-surface-2",
      elevated: "rounded-(--radius-xl) bg-card shadow-(--shadow-2)",
    },
  },
  defaultVariants: { variant: "default" },
});

function Card({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return (
    <div data-slot="card" data-variant={variant ?? "default"} className={cn(cardVariants({ variant }), className)} {...props}>
      <GlassBackdrop />
      {props.children}
    </div>
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("grid auto-rows-min items-start gap-1 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto]", className)}
      {...props}
    />
  );
}

/** Card titles use the h3 step. Keep sibling titles to the same line count (rule copy.sibling-parity). */
function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 data-slot="card-title" className={cn("text-[16px] leading-[24px] font-semibold text-text-1", className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="card-description" className={cn("text-[14px] leading-[20px] text-text-2", className)} {...props} />;
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-action" className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("flex-1 px-6 py-6", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("flex items-center gap-2 border-t border-border px-6 py-4", className)} {...props} />;
}

export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
