import { CreditCardIcon, DashboardSquare01Icon, Invoice01Icon, Settings01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@beam/ui/components/sidebar";
import { Icon } from "@beam/ui/icons";

const ITEMS = [
  { title: "Home", icon: DashboardSquare01Icon, active: true },
  { title: "Payments", icon: CreditCardIcon },
  { title: "Invoices", icon: Invoice01Icon },
  { title: "Customers", icon: UserGroupIcon },
  { title: "Settings", icon: Settings01Icon },
];

export default function SidebarDefault() {
  return (
    <SidebarProvider className="min-h-0 w-[260px]">
      <Sidebar collapsible="none" className="h-[380px] w-full rounded-(--radius-card) border border-border">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <span className="grid size-8 place-items-center rounded-(--radius-md) bg-primary text-[13px] font-bold text-primary-foreground">P</span>
                <span className="flex flex-col text-start leading-tight">
                  <span className="font-semibold">Pwani Payments</span>
                  <span className="text-[12px] text-text-3">Live mode</span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarMenu>
              {ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={item.active}>
                    <Icon icon={item.icon} size="sm" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
