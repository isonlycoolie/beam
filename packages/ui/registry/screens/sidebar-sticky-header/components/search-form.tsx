/* Based on shadcn/ui (MIT), converted to Beam components and tokens. */
import { SearchIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Label } from "@beam/ui/components/label";
import { SidebarInput } from "@beam/ui/components/sidebar";

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  return (
    <form {...props}>
      <div className="relative">
        <Label htmlFor="search" className="sr-only">
          SearchIcon
        </Label>
        <SidebarInput id="search" placeholder="Type to search..." className="h-(--control-sm) pl-7" />
        <HugeiconsIcon
          icon={SearchIcon}
          strokeWidth={1.75}
          className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none"
        />
      </div>
    </form>
  );
}
