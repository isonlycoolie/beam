/* Based on shadcn/ui (MIT), converted to Beam components and tokens. */
"use client";

import { CheckmarkBadge01Icon, CreditCardIcon, Logout01Icon, Notification01Icon, SparklesIcon, UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Avatar, AvatarFallback, AvatarImage } from "@beam/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@beam/ui/components/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@beam/ui/components/sidebar";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-(--control-sm) w-8 rounded-(--radius-card)">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-(--radius-card)">AJ</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-[14px] leading-[20px] leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-[12px] leading-[16px]">{user.email}</span>
              </div>
              <HugeiconsIcon icon={UnfoldMoreIcon} strokeWidth={1.75} className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-(--radius-card)"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-[14px] leading-[20px]">
                <Avatar className="h-(--control-sm) w-8 rounded-(--radius-card)">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-(--radius-card)">AJ</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-[14px] leading-[20px] leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-[12px] leading-[16px]">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <HugeiconsIcon icon={SparklesIcon} strokeWidth={1.75} />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <HugeiconsIcon icon={CheckmarkBadge01Icon} strokeWidth={1.75} />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={CreditCardIcon} strokeWidth={1.75} />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={Notification01Icon} strokeWidth={1.75} />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <HugeiconsIcon icon={Logout01Icon} strokeWidth={1.75} />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
