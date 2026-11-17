import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@beam/ui/components/collapsible";
import { SidebarMenuButton } from "@beam/ui/components/sidebar";
import { Icon } from "@beam/ui/icons";

export default function CollapsibleDefault() {
  return (
    <Collapsible defaultOpen className="w-[260px]">
      <CollapsibleTrigger asChild>
        <SidebarMenuButton href="#">
          <span>Core Resources</span>
          <Icon icon={ArrowDown01Icon} size="sm" className="ms-auto" />
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuButton href="#" nested>Customers</SidebarMenuButton>
        <SidebarMenuButton href="#" nested>Payment intents</SidebarMenuButton>
      </CollapsibleContent>
    </Collapsible>
  );
}
