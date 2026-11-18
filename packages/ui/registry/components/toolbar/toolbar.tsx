/* Anatomy from Sesama UI (MIT), behaviour from Radix Toolbar; styled as Beam's own controls (see CREDITS.md). */
"use client";

import { GlassBackdrop } from "../liquid-glass/liquid-glass";
import { cva, type VariantProps } from "class-variance-authority";
import { Toolbar as ToolbarPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "../../../lib/cn";
import { Button, buttonVariants } from "../button/button";

// The bar is a field at rest (--shadow-1 on --card). Its controls are Beam Buttons, ghost by default, so a change to
// Button changes the toolbar too. sm and md hold 28px buttons (sm packs them tighter); lg holds 36px buttons.
const toolbarVariants = cva("group/toolbar relative inline-flex w-fit items-center rounded-(--radius-lg) data-[orientation=vertical]:flex-col", {
  variants: {
    variant: {
      default: "bg-card text-text-1 shadow-(--shadow-1)",
      // A bare rail: no fill or ring, for controls that each carry their own (canvas zoom).
      ghost: "p-0! shadow-none",
    },
    size: {
      sm: "gap-1 p-0.5",
      md: "gap-1.5 p-1",
      lg: "gap-2 p-1.5",
    },
  },
  defaultVariants: { variant: "default", size: "md" },
});

type ToolbarSize = NonNullable<VariantProps<typeof toolbarVariants>["size"]>;
const ToolbarContext = React.createContext<ToolbarSize>("md");
/** The Button size for a control in a toolbar of this size: words, or an icon alone. */
const controlSize = (size: ToolbarSize, icon: boolean) => (size === "lg" ? (icon ? "icon" : "md") : icon ? "icon-sm" : "sm");

function Toolbar({ className, variant, size, children, ...props }: React.ComponentProps<typeof ToolbarPrimitive.Root> & VariantProps<typeof toolbarVariants>) {
  return (
    <ToolbarContext.Provider value={size ?? "md"}>
      <ToolbarPrimitive.Root
        data-slot="toolbar"
        data-variant={variant ?? "default"}
        data-size={size ?? "md"}
        className={cn(toolbarVariants({ variant, size }), className)}
        {...props}
      >
        {variant !== "ghost" && <GlassBackdrop />}
        {children}
      </ToolbarPrimitive.Root>
    </ToolbarContext.Provider>
  );
}

type ControlProps = {
  /** Any Button variant; ghost by default. */
  variant?: VariantProps<typeof buttonVariants>["variant"];
  /** "icon" for an icon-only control (give it an aria-label); it is sized to match the toolbar. */
  size?: "default" | "icon";
};

/** A Beam Button inside the toolbar's arrow-key order. */
function ToolbarButton({ className, variant = "ghost", size = "default", children, ...props }: React.ComponentProps<typeof ToolbarPrimitive.Button> & ControlProps) {
  const toolbarSize = React.useContext(ToolbarContext);
  return (
    <ToolbarPrimitive.Button asChild {...props}>
      <Button variant={variant} size={controlSize(toolbarSize, size === "icon")} className={className}>
