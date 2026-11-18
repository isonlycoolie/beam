/* Based on shadcn/ui (MIT), converted to Beam components and tokens. */
import { Calendar } from "@beam/ui/components/calendar";
import { SidebarGroup, SidebarGroupContent } from "@beam/ui/components/sidebar";

export function DatePicker() {
  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent>
        <Calendar className="[&_[role=gridcell]]:w-[33px] [&_[role=gridcell].bg-secondary]:bg-sidebar-primary [&_[role=gridcell].bg-secondary]:text-sidebar-primary-foreground" />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
