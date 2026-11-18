/* Based on shadcn/ui (MIT), converted to Beam components and tokens. */
"use client";

import * as React from "react";
import {
  AiFileIcon,
  Analytics01Icon,
  Camera01Icon,
  ChartBarLineIcon,
  CircleIcon,
  DashboardSquare01Icon,
  Database01Icon,
  Doc01Icon,
  File01Icon,
  Folder01Icon,
  HelpCircleIcon,
  LeftToRightListBulletIcon,
  Search01Icon,
  Settings01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { NavDocuments } from "./nav-documents";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@beam/ui/components/sidebar";

const data = {
  user: {
    name: "Amina Juma",
    email: "amina@pwani.co",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: DashboardSquare01Icon,
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: LeftToRightListBulletIcon,
    },
    {
      title: "Analytics",
      url: "#",
      icon: ChartBarLineIcon,
    },
    {
      title: "Projects",
      url: "#",
      icon: Folder01Icon,
    },
    {
      title: "Team",
      url: "#",
      icon: UserGroupIcon,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: Camera01Icon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: File01Icon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: AiFileIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings01Icon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: Search01Icon,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: Database01Icon,
    },
    {
      name: "Reports",
      url: "#",
      icon: Analytics01Icon,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: Doc01Icon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href="#">
                <HugeiconsIcon icon={CircleIcon} strokeWidth={1.75} className="size-5!" />
                <span className="text-[16px] leading-[24px] font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
