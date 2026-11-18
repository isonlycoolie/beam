/* Based on shadcn/ui (MIT), converted to Beam components and tokens. */
"use client";

import * as React from "react";
import { ArchiveXIcon, CommandIcon, Delete02Icon, FileIcon, InboxIcon, SendIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { NavUser } from "./nav-user";
import { Label } from "@beam/ui/components/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@beam/ui/components/sidebar";
import { Switch } from "@beam/ui/components/switch";

// This is sample data
const data = {
  user: {
    name: "Amina Juma",
    email: "amina@pwani.co",
    avatar: "",
  },
  navMain: [
    {
      title: "InboxIcon",
      url: "#",
      icon: InboxIcon,
      isActive: true,
    },
    {
      title: "Drafts",
      url: "#",
      icon: FileIcon,
      isActive: false,
    },
    {
      title: "Sent",
      url: "#",
      icon: SendIcon,
      isActive: false,
    },
    {
      title: "Junk",
      url: "#",
      icon: ArchiveXIcon,
      isActive: false,
    },
    {
      title: "Trash",
      url: "#",
      icon: Delete02Icon,
      isActive: false,
    },
  ],
  mails: [
    {
      name: "William Smith",
      email: "williamsmith@example.com",
      subject: "Meeting Tomorrow",
      date: "09:34 AM",
      teaser: "Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates.",
    },
    {
      name: "Alice Smith",
      email: "alicesmith@example.com",
      subject: "Re: Project Update",
      date: "Yesterday",
      teaser: "Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps.",
    },
    {
      name: "Bob Johnson",
      email: "bobjohnson@example.com",
      subject: "Weekend Plans",
      date: "2 days ago",
      teaser: "Hey everyone! I'm thinking of organizing a team outing this weekend.\nWould you be interested in a hiking trip or a beach day?",
    },
    {
      name: "Emily Davis",
      email: "emilydavis@example.com",
      subject: "Re: Question about Budget",
      date: "2 days ago",
      teaser: "I've reviewed the budget numbers you sent over.\nCan we set up a quick call to discuss some potential adjustments?",
    },
    {
      name: "Michael Wilson",
      email: "michaelwilson@example.com",