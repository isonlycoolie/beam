/* Based on shadcn/ui (MIT). Sizes, type and shadows are measured references (see CREDITS.md). */
import { Slot } from "radix-ui";
import type * as React from "react";
import { cn } from "../../../lib/cn";

// Docs navigation: section labels 14/600 uppercase in --text-2; items 28px, 4/8px padding (16px when
// nested), 14/500/20px, 4px radius; the active item is --link on a 10% --link fill. On phones, put the
// Sidebar inside a Sheet.
function Sidebar({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav data-slot="sidebar" className={cn("flex w-[260px] shrink-0 flex-col gap-6 text-[14px] leading-[20px]", className)} {...props} />;
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-group" className={cn("flex flex-col gap-1", className)} {...props} />;
}

function SidebarGroupLabel({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-group-label" className={cn("text-[14px] leading-[20px] font-semibold uppercase text-text-2", className)} {...props} />;
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="sidebar-menu" className={cn("flex flex-col gap-0.5", className)} {...props} />;
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="sidebar-menu-item" className={cn("relative", className)} {...props} />;
}

function SidebarMenuButton({ asChild, isActive, nested, className, ...props }: React.ComponentProps<"a"> & { asChild?: boolean; isActive?: boolean; nested?: boolean }) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      data-slot="sidebar-menu-button"
      data-active={isActive || undefined}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex h-7 w-full items-center gap-2 rounded-[4px] py-1 pe-2 text-[14px] leading-[20px] font-medium text-text-1 outline-none",
        nested ? "ps-4" : "ps-2",
        "hover:text-link focus-visible:shadow-(--focus-ring) data-[active]:bg-link/10 data-[active]:text-link [&_svg]:size-3 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="sidebar-menu-sub" className={cn("flex flex-col gap-0.5", className)} {...props} />;
}

export { Sidebar, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub };
