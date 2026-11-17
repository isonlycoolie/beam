import { CodeIcon, Globe02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@beam/ui/components/button";
import { DropdownMenu, DropdownMenuCardItem, DropdownMenuContent, DropdownMenuTrigger } from "@beam/ui/components/dropdown-menu";
import { Icon } from "@beam/ui/icons";
import type { ComponentType } from "react";

/** Overlays set up like their measured captures; checked through their portal content (components/ref-list.json). */
export const OVERLAY_REFS: Record<string, { mode: "light" | "dark"; Component: ComponentType }> = {
  "ui-menu-cards": {
    mode: "light",
    Component: () => (
      <DropdownMenu open modal={false}>
        <DropdownMenuTrigger asChild>
          <Button>Get started</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="flex w-[514px] flex-col gap-4 p-4">
          <DropdownMenuCardItem icon={<Icon icon={CodeIcon} />} title="Embed your prebuilt form" description="Follow our Quickstart guide to add a payment form to your website." />
          <DropdownMenuCardItem icon={<Icon icon={Globe02Icon} />} title="Publish a hosted page without code" description="Use the dashboard to create a payment link that you can share with your customers." />
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
};
