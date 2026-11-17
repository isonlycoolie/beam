/* Based on shadcn/ui (MIT). Restyled for Beam UI: token heights, a clear focus ring, a real loading state. */
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";
import { Icon } from "../../../icons/icon";
import { cn } from "../../../lib/cn";

const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-(--radius-md) font-medium",
    "transition-[background-color,border-color,color,box-shadow,transform] duration-(--dur-fast) ease-(--ease-out)",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:ring-2 aria-invalid:ring-danger/40",
  ],
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-(--shadow-1) hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        outline: "border border-input bg-transparent text-text-1 shadow-(--shadow-1) hover:bg-accent",
        ghost: "text-text-1 hover:bg-accent",
        // Soft, so one red never shouts over the page; danger on danger-soft is contrast-tested in every palette.
        destructive: "bg-danger-soft text-danger hover:bg-danger-soft/70 focus-visible:ring-danger",
        link: "h-auto px-0 text-text-1 underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-(--control-sm) px-3 text-small",
        md: "h-(--control-md) px-4 text-body",
        lg: "h-(--control-lg) px-5 text-body",
        icon: "size-(--control-md) p-0",
        "icon-sm": "size-(--control-sm) p-0",
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
      {loading ? (
        <>
          {/* The label stays in the layout so the button keeps its width while loading. */}
          <span className="invisible inline-flex items-center gap-2">{children}</span>
          <Icon icon={Loading03Icon} size="sm" className="absolute animate-spin" label="Loading" />
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonVariants, type ButtonProps };
