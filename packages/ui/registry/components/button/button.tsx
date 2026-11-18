/* Based on shadcn/ui (MIT). Sizes, type, radius and shadows are measured references (see CREDITS.md). */
import { GlassBackdrop } from "../liquid-glass/liquid-glass";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";
import { Icon } from "../../../icons/icon";
import { cn } from "../../../lib/cn";

// Measured sizes: sm 28px (4/8px padding, 14/600), md 36px (6/16px, 14/500/24px), lg 40px (12px, 14/500).
const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-(--radius-md)",
    "transition-[background-color,color,box-shadow] duration-(--dur-fast) ease-(--ease-out)",
    "outline-none focus-visible:shadow-(--focus-ring) disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:shadow-[0_0_0_1px_var(--danger)]",
    // As in shadcn: bare SVGs (provider logos) sit at 16px; Beam icons carry their own width and keep it.
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([width])]:size-4",
  ],
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-(--shadow-button) hover:bg-primary/90",
        secondary: "bg-secondary text-text-1 hover:bg-accent",
        outline: "bg-card text-text-1 shadow-[0_0_0_1px_var(--input)] hover:bg-surface-2",
        ghost: "text-text-2 hover:bg-secondary hover:text-text-1",
        // Soft, so one red never shouts over the page; danger on danger-soft is contrast-tested in every palette.
        destructive: "bg-danger-soft text-danger hover:bg-danger-soft/70",
        link: "h-auto px-0 py-0 text-link hover:underline underline-offset-4",
      },
      size: {
        sm: "px-2 py-1 text-[14px] leading-[20px] font-semibold",
        md: "px-4 py-1.5 text-[14px] leading-[24px] font-medium",
        lg: "p-3 text-[14px] leading-[16.1px] font-medium",
        icon: "size-(--control-md) p-0",
        "icon-sm": "size-(--control-sm) p-0",
        "icon-xs": "size-6 rounded-[4px] p-0 [&_svg]:size-3.5",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    /** Shows a spinner, keeps the width, and blocks clicks until the action finishes. */
    loading?: boolean;
  };

function Button({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      data-variant={variant ?? "default"}
      data-size={size ?? "md"}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {asChild ? (
        // Slot takes exactly one child: with asChild the child element is the button, without a glass layer.
        children
      ) : (
        <>
          <GlassBackdrop />
          {loading ? (
            <>
              {/* The label stays in the layout so the button keeps its width while loading. */}
              <span className="invisible inline-flex items-center gap-1.5">{children}</span>
              <Icon icon={Loading03Icon} size="sm" className="absolute animate-spin" label="Loading" />
            </>
          ) : (
            children
          )}
        </>
      )}
    </Comp>
  );
}

export { Button, buttonVariants, type ButtonProps };
