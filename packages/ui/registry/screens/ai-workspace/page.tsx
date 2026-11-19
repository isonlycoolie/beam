/* Anatomy from Sesama UI's agent workspace (MIT), built from Beam components and tokens. */
"use client";

import * as React from "react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { AppSidebar } from "./components/app-sidebar";
import { Conversation } from "./components/conversation";
import { Composer, ComposerAction, ComposerFooter, ComposerInput, ComposerSubmit } from "@beam/ui/components/composer";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@beam/ui/components/message-scroller";
import { Separator } from "@beam/ui/components/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@beam/ui/components/sidebar";
import { StatusDot } from "@beam/ui/components/status-dot";
import { Icon } from "@beam/ui/icons";

export default function Page() {
  const [status, setStatus] = React.useState<"idle" | "running">("running");
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-svh">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <h1 className="text-[14px] leading-[20px] font-medium text-text-1">Payout review</h1>
          <StatusDot variant={status === "running" ? "info" : "success"} pulse={status === "running"} className="ms-auto">
            {status === "running" ? "Working" : "Ready"}
          </StatusDot>
        </header>
        <MessageScrollerProvider>
          <MessageScroller className="min-h-0 flex-1">
            <MessageScrollerViewport>
              <MessageScrollerContent className="mx-auto flex w-full max-w-[760px] flex-col gap-6 px-4 py-6">
                <Conversation />
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
        <div className="mx-auto w-full max-w-[760px] px-4 pb-4">
          <Composer status={status} onSubmit={() => setStatus("running")} onStop={() => setStatus("idle")}>
            <ComposerInput placeholder="Ask a follow-up" />
            <ComposerFooter>
              <ComposerAction aria-label="Add files">
                <Icon icon={Add01Icon} size="sm" />
              </ComposerAction>
              <ComposerSubmit className="ms-auto" />
            </ComposerFooter>
          </Composer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
