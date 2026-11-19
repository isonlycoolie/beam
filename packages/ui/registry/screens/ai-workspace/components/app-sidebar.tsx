/* Anatomy from Sesama UI's agent workspace (MIT), built from Beam components and tokens. */
"use client";

import type * as React from "react";
import { Add01Icon, File01Icon, Folder01Icon, Message01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@beam/ui/components/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@beam/ui/components/sidebar";
import { Tree, TreeSection, type TreeItem } from "@beam/ui/components/tree";
import { Icon } from "@beam/ui/icons";

const chats = [
  { title: "Payout review", active: true },
  { title: "Refund policy draft" },
  { title: "Fees page copy" },
  { title: "Weekly report" },
];

const files: TreeItem[] = [
  {
    id: "payouts",
    label: "payouts",
    icon: Folder01Icon,
    children: [
      { id: "failed", label: "failed-payouts.csv", icon: File01Icon },
      { id: "banks", label: "bank-replies.md", icon: File01Icon },
    ],
  },
  { id: "drafts", label: "drafts", icon: Folder01Icon, children: [{ id: "emails", label: "owner-emails.md", icon: File01Icon }] },
  { id: "brief", label: "brief.md", icon: File01Icon },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Button variant="outline" className="w-full justify-start">
          <Icon icon={Add01Icon} size="sm" />
          New chat
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map((chat) => (
                <SidebarMenuItem key={chat.title}>
                  <SidebarMenuButton isActive={chat.active}>
                    <Icon icon={Message01Icon} size="sm" />
                    <span>{chat.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <TreeSection title="Files" className="p-2">
          <Tree aria-label="Files" items={files} defaultExpanded={["payouts"]} defaultSelected="failed" />
        </TreeSection>
      </SidebarContent>
    </Sidebar>
  );
}
