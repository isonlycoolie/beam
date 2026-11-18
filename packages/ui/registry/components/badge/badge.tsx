/* Based on shadcn/ui (MIT). Sizes, type and shadows are measured references (see CREDITS.md). */
import { GlassBackdrop } from "../liquid-glass/liquid-glass";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";
import { cn } from "../../../lib/cn";

// Chip: 22px, 12/500/16px, 2/8px padding, 6px radius, 1px --input border. Status tones are the
// palette's soft pairs. lg is the discount tag (14/500/18.2px, 8/12px, --secondary fill).
const badgeVariants = cva("inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-(--radius-md) font-medium [&_svg]:size-3.5", {
  variants: {
    variant: {
      default: "border border-input bg-card text-text-1",
      secondary: "border border-transparent bg-secondary text-text-1",
      outline: "border border-input text-text-2",
      success: "border border-transparent bg-success-soft text-success",
      warning: "border border-transparent bg-warning-soft text-warning",
      danger: "border border-transparent bg-danger-soft text-danger",
      // The shared name for danger, as on Button.
      destructive: "border border-transparent bg-danger-soft text-danger",
    },
    size: {
      sm: "px-1.5 py-px text-[11px] leading-[14px]",
      md: "px-2 py-0.5 text-[12px] leading-[16px]",
      lg: "gap-1 px-3 py-2 text-[14px] leading-[18.2px] [&_svg]:size-4",
    },
  },
  defaultVariants: { variant: "default", size: "md" },
});

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";
  return (
    <Comp data-slot="badge" data-variant={variant ?? "default"} data-size={size ?? "md"} className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {/* Slot takes exactly one child: with asChild the child element is the badge, without a glass layer. */}
      {asChild ? (
        props.children
      ) : (
        <>
          <GlassBackdrop />
          {props.children}
        </>
      )}
    </Comp>
  );
}

export { Badge, badgeVariants };
