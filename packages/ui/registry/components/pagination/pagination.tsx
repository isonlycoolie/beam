/* Based on shadcn/ui (MIT). Sizes, type and shadows are measured references (see CREDITS.md). */
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import type * as React from "react";
import { Icon } from "../../../icons/icon";
import { cn } from "../../../lib/cn";
import { buttonVariants } from "../button/button";

// Built from the measured small buttons: outline for the current page, ghost for the rest.
function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="Pagination" data-slot="pagination" className={cn("flex", className)} {...props} />;
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="pagination-content" className={cn("flex items-center gap-1", className)} {...props} />;
}

function PaginationItem(props: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

function PaginationLink({ className, isActive, ...props }: React.ComponentProps<"a"> & { isActive?: boolean }) {
  return (
    <a
      data-slot="pagination-link"
      aria-current={isActive ? "page" : undefined}
      className={cn(buttonVariants({ variant: isActive ? "outline" : "ghost", size: "sm" }), "min-w-7 justify-center", className)}
      {...props}
    />
  );
}

function PaginationPrevious({ className, children = "Previous", ...props }: React.ComponentProps<"a">) {
  return (
    <PaginationLink aria-label="Previous page" className={cn("gap-1 ps-1.5", className)} {...props}>
      <Icon icon={ArrowLeft01Icon} size="sm" />
      {children}
    </PaginationLink>
  );
}

function PaginationNext({ className, children = "Next", ...props }: React.ComponentProps<"a">) {
  return (
    <PaginationLink aria-label="Next page" className={cn("gap-1 pe-1.5", className)} {...props}>
      {children}
      <Icon icon={ArrowRight01Icon} size="sm" />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span aria-hidden data-slot="pagination-ellipsis" className={cn("grid size-7 place-items-center text-text-3", className)} {...props}>
      …
    </span>
  );
}

export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious };
