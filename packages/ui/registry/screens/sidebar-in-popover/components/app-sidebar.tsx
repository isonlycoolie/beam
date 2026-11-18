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
  ],
  favorites: [
    {
      name: "Project Management & Task Tracking",
      url: "#",
      emoji: "📊",
    },
    {
      name: "Family Recipe Collection & Meal Planning",
      url: "#",
      emoji: "🍳",
    },
    {
      name: "Fitness Tracker & Workout Routines",
      url: "#",
      emoji: "💪",
    },
    {
      name: "Book Notes & Reading List",
      url: "#",
      emoji: "📚",
    },
    {
      name: "Sustainable Gardening Tips & Plant Care",
      url: "#",
      emoji: "🌱",
    },
    {
      name: "Language Learning Progress & Resources",
      url: "#",
      emoji: "🗣️",
    },
    {
      name: "HomeIcon Renovation Ideas & Budget Tracker",
      url: "#",
      emoji: "🏠",
    },
    {
      name: "Personal Finance & Investment Portfolio",
      url: "#",
      emoji: "💰",
    },
    {
      name: "Movie & TV Show Watchlist with Reviews",
      url: "#",
      emoji: "🎬",
    },
    {
      name: "Daily Habit Tracker & Goal Setting",
      url: "#",
      emoji: "✅",
    },
  ],
  workspaces: [
    {
      name: "Personal Life Management",
      emoji: "🏠",
      pages: [
        {
          name: "Daily Journal & Reflection",
          url: "#",
          emoji: "📔",
        },
        {
          name: "Health & Wellness Tracker",
          url: "#",
          emoji: "🍏",
        },
        {
          name: "Personal Growth & Learning Goals",
          url: "#",
          emoji: "🌟",
        },
      ],
    },
    {
      name: "Professional Development",
      emoji: "💼",
      pages: [
        {
          name: "Career Objectives & Milestones",
          url: "#",
          emoji: "🎯",
        },
        {
          name: "Skill Acquisition & Training Log",
          url: "#",
          emoji: "🧠",
        },
        {
          name: "Networking Contacts & Events",
          url: "#",
          emoji: "🤝",
        },
      ],
    },
    {
      name: "Creative Projects",
      emoji: "🎨",
      pages: [
        {
          name: "Writing Ideas & Story Outlines",
          url: "#",
          emoji: "✍️",
        },
        {
          name: "Art & Design Portfolio",
          url: "#",
          emoji: "🖼️",
        },
        {
          name: "Music Composition & Practice Log",
          url: "#",
          emoji: "🎵",
        },
      ],
    },
    {
      name: "HomeIcon Management",
      emoji: "🏡",
      pages: [
        {
          name: "Household Budget & Expense Tracking",
          url: "#",
          emoji: "💰",
        },
        {
          name: "HomeIcon Maintenance Schedule & Tasks",
          url: "#",
          emoji: "🔧",
        },
        {
          name: "Family CalendarIcon & Event Planning",
          url: "#",
          emoji: "📅",
        },
      ],
    },
    {
      name: "Travel & Adventure",
      emoji: "🧳",
      pages: [
        {
          name: "Trip Planning & Itineraries",
          url: "#",
          emoji: "🗺️",
        },
        {
          name: "Travel Bucket List & Inspiration",
          url: "#",
          emoji: "🌎",
        },
        {
          name: "Travel Journal & Photo Gallery",
          url: "#",
          emoji: "📸",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites favorites={data.favorites} />
        <NavWorkspaces workspaces={data.workspaces} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
