"use client";

import { ArrowRight01Icon, CreditCardIcon, Invoice01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@beam/ui/components/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from "@beam/ui/components/sidebar";
import { Icon } from "@beam/ui/icons";

const NAV = [
  { title: "Payments", icon: CreditCardIcon, items: ["All payments", "Disputes", "Payouts"] },
  { title: "Billing", icon: Invoice01Icon, items: ["Subscriptions", "Invoices", "Quotes"] },
  { title: "Customers", icon: UserGroupIcon, items: ["All customers", "Segments"] },
];

// Parents with children: each parent opens its own list.
export default function SidebarNested() {
  return (
    <SidebarProvider className="min-h-0 w-[260px]">
      <Sidebar collapsible="none" className="h-[380px] w-full rounded-(--radius-card) border border-border">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Products</SidebarGroupLabel>
            <SidebarMenu>
              {NAV.map((parent, i) => (
                <Collapsible key={parent.title} defaultOpen={i === 0} className="group/collapsible" asChild>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <Icon icon={parent.icon} size="sm" />
                        <span>{parent.title}</span>
                        <Icon icon={ArrowRight01Icon} size="sm" className="ms-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {parent.items.map((child, k) => (
                          <SidebarMenuSubItem key={child}>
                            <SidebarMenuSubButton href="#" isActive={i === 0 && k === 0}>
                              <span>{child}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
