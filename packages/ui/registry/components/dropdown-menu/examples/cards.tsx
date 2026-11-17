import { ArrowDown01Icon, CodeIcon, Globe02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@beam/ui/components/button";
import { DropdownMenu, DropdownMenuCardItem, DropdownMenuContent, DropdownMenuTrigger } from "@beam/ui/components/dropdown-menu";
import { Icon } from "@beam/ui/icons";

export default function DropdownMenuCards() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          Get started <Icon icon={ArrowDown01Icon} size="sm" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex w-[514px] flex-col gap-4 p-4">
        <DropdownMenuCardItem icon={<Icon icon={CodeIcon} />} title="Embed your prebuilt form" description="Follow the quickstart guide to add a payment form to your website." />
        <DropdownMenuCardItem icon={<Icon icon={Globe02Icon} />} title="Publish a hosted page without code" description="Create a payment link in the dashboard that you can share with your customers." />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
