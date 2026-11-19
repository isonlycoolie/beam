/* Anatomy from Sesama UI (MIT), behaviour from Radix Collapsible; styled as Beam's own surfaces (see CREDITS.md). */
"use client";

import { ArrowDown01Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import type * as React from "react";
import { Icon } from "../../../icons/icon";
import { cn } from "../../../lib/cn";
import { GlassBackdrop } from "../liquid-glass/liquid-glass";
import { RunMeta, RunStateIcon, type RunState } from "../tool-call/tool-call";

const chevron = (group: string) =>
  cn("ms-auto size-3 text-text-3 transition-transform duration-(--dur-fast)", group);

type AgentRunProps = React.ComponentProps<typeof CollapsiblePrimitive.Root> & {
  /** What the agent is doing, as a short task: "Review project". */
  title: React.ReactNode;
  state?: RunState;
  /** How long the run took: "12s". */
  duration?: string;
};

// One run on the field surface (card, field shadow, 10px radius): the title row opens the steps below a hairline.
function AgentRun({ title, state = "completed", duration, className, children, ...props }: AgentRunProps) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="agent-run"
      data-status={state}
      className={cn("group/agent-run relative w-full min-w-0 rounded-(--radius-lg) bg-card text-text-1 shadow-(--shadow-1)", className)}
      {...props}
    >
      <GlassBackdrop />
      <CollapsiblePrimitive.Trigger
        data-slot="agent-run-trigger"
        className="flex w-full items-center gap-2 rounded-(--radius-lg) px-3 py-2.5 text-start text-[14px] leading-[20px] font-medium outline-none hover:text-link focus-visible:shadow-(--focus-ring)"
      >
        <RunStateIcon state={state} />
        <span className="min-w-0 truncate">{title}</span>
        <RunMeta state={state} duration={duration} className="font-normal" />
        <Icon icon={ArrowDown01Icon} size="sm" className={chevron("group-data-[state=open]/agent-run:rotate-180")} />
      </CollapsiblePrimitive.Trigger>
      <CollapsiblePrimitive.Content data-slot="agent-run-content" className="overflow-hidden">
        <div className="flex flex-col gap-0.5 border-t border-border px-3 py-2">
          {children ?? <p className="py-1.5 text-[12px] leading-[16px] text-text-3">No steps recorded.</p>}
        </div>
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  );
}

// A plain step: its state mark and one line. The step that is running reads in the strong text colour.
function AgentRunStep({ state = "completed", className, children, ...props }: React.ComponentProps<"div"> & { state?: RunState }) {
  return (
    <div
      data-slot="agent-run-step"
      data-status={state}
      className={cn("flex items-center gap-2 py-1.5 text-[14px] leading-[20px] text-text-2 data-[status=running]:text-text-1", className)}
      {...props}
    >
      <RunStateIcon state={state} />
      <span className="min-w-0">{children}</span>
    </div>
  );
}

type AgentRunThinkingProps = React.ComponentProps<typeof CollapsiblePrimitive.Root> & {
  title?: React.ReactNode;
  state?: RunState;
};

// The model's reasoning, folded away by default: a sparkle (the Spinner while thinking), then the text in quiet type.
function AgentRunThinking({ title = "Thinking", state = "completed", className, children, ...props }: AgentRunThinkingProps) {
  return (
    <CollapsiblePrimitive.Root data-slot="agent-run-thinking" data-status={state} className={cn("group/thinking", className)} {...props}>
      <CollapsiblePrimitive.Trigger className="flex w-full items-center gap-2 rounded-(--radius-sm) py-1.5 text-start text-[14px] leading-[20px] text-text-2 outline-none hover:text-link focus-visible:shadow-(--focus-ring)">
        {state === "running" ? <RunStateIcon state="running" /> : <Icon icon={SparklesIcon} size="sm" className="text-text-3" />}
        <span className="min-w-0 truncate">{title}</span>
        <RunMeta state={state} />
        <Icon icon={ArrowDown01Icon} size="sm" className={chevron("group-data-[state=open]/thinking:rotate-180")} />
      </CollapsiblePrimitive.Trigger>
      <CollapsiblePrimitive.Content className="overflow-hidden">
        <div className="ms-2 border-s border-border py-1 ps-4 text-[14px] leading-[20px] text-text-3">{children}</div>
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  );
}

export { AgentRun, AgentRunStep, AgentRunThinking };
