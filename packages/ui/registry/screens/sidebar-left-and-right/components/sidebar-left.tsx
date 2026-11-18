/* Based on shadcn/ui (MIT), converted to Beam components and tokens. */
"use client";

import * as React from "react";
import {
  AudioWaveformIcon,
  BlocksIcon,
  CalendarIcon,
  CommandIcon,
  Delete02Icon,
  HelpCircleIcon,
  HomeIcon,
  InboxIcon,
  SearchIcon,
  Settings02Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { NavFavorites } from "./nav-favorites";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavWorkspaces } from "./nav-workspaces";
import { TeamSwitcher } from "./team-switcher";
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@beam/ui/components/sidebar";

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: CommandIcon,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveformIcon,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: CommandIcon,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "SearchIcon",
      url: "#",
      icon: SearchIcon,
    },
    {
      title: "Ask AI",
      url: "#",
      icon: SparklesIcon,
    },
    {
      title: "HomeIcon",
      url: "#",
      icon: HomeIcon,
      isActive: true,
    },
    {
      title: "InboxIcon",
      url: "#",
      icon: InboxIcon,
      badge: "10",
    },
  ],
  navSecondary: [
    {
      title: "CalendarIcon",
      url: "#",
      icon: CalendarIcon,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings02Icon,
    },
    {
      title: "Templates",
      url: "#",
      icon: BlocksIcon,
    },
    {
      title: "Trash",
      url: "#",
      icon: Delete02Icon,
    },
    {
      title: "Help",
      url: "#",
      icon: HelpCircleIcon,
    },