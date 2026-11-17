/* Based on shadcn/ui (MIT). Restyled for Beam UI: soft status tones, one height, never colour alone. */
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";
import { cn } from "../../../lib/cn";

const badgeVariants = cva(
  "inline-flex h-6 w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-caption [&_svg]:size-3.5",
  {
    variants: {
      variant: {
        neutral: "bg-surface-2 text-text-2 ring-1 ring-inset ring-border",
        primary: "bg-primary text-primary-foreground",
        success: "bg-success-soft text-success",
        warning: "bg-warning-soft text-warning",
        danger: "bg-danger-soft text-danger",
        outline: "text-text-2 ring-1 ring-inset ring-border",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";
  return <Comp data-slot="badge" data-variant={variant ?? "neutral"} className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
