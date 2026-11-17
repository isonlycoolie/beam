import { Sidebar, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@beam/ui/components/sidebar";

const ITEMS = ["Overview", "Find your use case", "Payment links", "Recurring payments", "Migrate legacy integrations"];

export default function SidebarDefault() {
  return (
    <Sidebar>
      <SidebarGroup>
        <SidebarGroupLabel>Online payments</SidebarGroupLabel>
        <SidebarMenu>
          {ITEMS.map((item, i) => (
            <SidebarMenuItem key={item}>
              <SidebarMenuButton href="#" nested isActive={i === 1}>
                {item}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </Sidebar>
  );
}
