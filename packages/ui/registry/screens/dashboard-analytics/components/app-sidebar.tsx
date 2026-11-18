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