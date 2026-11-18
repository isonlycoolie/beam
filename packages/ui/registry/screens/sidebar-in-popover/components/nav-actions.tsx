/* Based on shadcn/ui (MIT), converted to Beam components and tokens. */
"use client";

import * as React from "react";
import {
  ArrowDown02Icon,
  ArrowUpIcon,
  ChartLineIcon,
  CopyIcon,
  CornerUpLeftIcon,
  CornerUpRightIcon,
  Delete02Icon,
  FileTextIcon,
  LayoutGridIcon,
  LinkIcon,
  MoreHorizontalIcon,
  Notification01Icon,
  Settings02Icon,
  StarIcon,
  TrashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@beam/ui/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@beam/ui/components/popover";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@beam/ui/components/sidebar";

const data = [
  [
    {
      label: "Customize Page",
      icon: Settings02Icon,
    },
    {
      label: "Turn into wiki",
      icon: FileTextIcon,
    },
  ],
  [
    {
      label: "CopyIcon LinkIcon",
      icon: LinkIcon,
    },
    {
      label: "Duplicate",
      icon: CopyIcon,
    },
    {
      label: "Move to",
      icon: CornerUpRightIcon,
    },
    {
      label: "Move to TrashIcon",
      icon: Delete02Icon,
    },
  ],
  [
    {
      label: "Undo",
      icon: CornerUpLeftIcon,
    },
    {
      label: "View analytics",
      icon: ChartLineIcon,
    },
    {
      label: "Version History",
      icon: LayoutGridIcon,
    },
    {
      label: "Show delete pages",
      icon: TrashIcon,
    },
    {
      label: "Notifications",
      icon: Notification01Icon,
    },
  ],
  [
    {
      label: "Import",
      icon: ArrowUpIcon,
    },
    {
      label: "Export",
      icon: ArrowDown02Icon,
    },
  ],
];

export function NavActions() {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <div className="flex items-center gap-2 text-[14px] leading-[20px]">
      <div className="hidden font-medium text-text-2 md:inline-block">Edit Oct 08</div>
      <Button variant="ghost" size="icon" className="h-7 w-7">
        <HugeiconsIcon icon={StarIcon} strokeWidth={1.75} />
      </Button>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7 data-[state=open]:bg-secondary">
            <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={1.75} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 overflow-hidden rounded-(--radius-card) p-0" align="end">
          <Sidebar collapsible="none" className="bg-transparent">
            <SidebarContent>
              {data.map((group, index) => (
                <SidebarGroup key={index} className="border-b last:border-none">
                  <SidebarGroupContent className="gap-0">
                    <SidebarMenu>
                      {group.map((item, index) => (
                        <SidebarMenuItem key={index}>
                          <SidebarMenuButton>
                            <HugeiconsIcon icon={item.icon} strokeWidth={1.75} /> <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
    </div>
  );
}
