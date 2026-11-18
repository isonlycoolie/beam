/* Based on shadcn/ui (MIT), converted to Beam components and tokens. */
import { SearchIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Label } from "@beam/ui/components/label";
import { SidebarGroup, SidebarGroupContent, SidebarInput } from "@beam/ui/components/sidebar";

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  return (
    <form {...props}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            SearchIcon
          </Label>
          <SidebarInput id="search" placeholder="SearchIcon the docs..." className="pl-8" />
          <HugeiconsIcon
            icon={SearchIcon}
            strokeWidth={1.75}
            className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none"
          />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}
