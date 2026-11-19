/* Anatomy from Sesama UI (MIT), behaviour from Radix Collapsible; styled as Beam's Accordion (see CREDITS.md). */
"use client";

import { ArrowDown01Icon, CancelCircleIcon, CheckmarkCircle02Icon, Clock01Icon, CodeIcon, StopCircleIcon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import type * as React from "react";
import { Icon } from "../../../icons/icon";
import { cn } from "../../../lib/cn";
import { Spinner } from "../spinner/spinner";

type RunState = "queued" | "running" | "completed" | "failed" | "cancelled";

const RUN_STATE_LABEL: Record<RunState, string> = {
  queued: "Queued",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
  cancelled: "Cancelled",
};

// One mark per state, 16px: the Spinner while running, then a tick, a cross, a stop or a clock in the state's colour.
function RunStateIcon({ state, className }: { state: RunState; className?: string }) {
  if (state === "running") return <Spinner label={RUN_STATE_LABEL.running} className={cn("text-text-2", className)} />;
  const icon = { queued: Clock01Icon, completed: CheckmarkCircle02Icon, failed: CancelCircleIcon, cancelled: StopCircleIcon }[state];
  const tone = { queued: "text-text-3", completed: "text-success", failed: "text-danger", cancelled: "text-text-3" }[state];
  return <Icon icon={icon} size="sm" label={RUN_STATE_LABEL[state]} className={cn(tone, className)} />;
}

// "Completed · 1.2s": the state in words, then the time it took. Failed reads in the danger colour.
function RunMeta({ state, duration, className }: { state: RunState; duration?: string; className?: string }) {
  return (
    <span data-slot="run-meta" className={cn("shrink-0 text-[12px] leading-[16px] text-text-3", state === "failed" && "text-danger", className)}>
      {RUN_STATE_LABEL[state]}
      {duration ? ` · ${duration}` : null}
    </span>
  );
}

type ToolCallProps = React.ComponentProps<typeof CollapsiblePrimitive.Root> & {
  /** The tool's name, as the agent called it: "Search files". */
  name: React.ReactNode;
  state?: RunState;
  /** How long the call took: "1.2s". */
  duration?: string;
  /** The tool's icon; a Spinner replaces it while the call runs. */
  icon?: IconSvgElement;
};

// The trigger is Accordion's row at a list's pace: 14/20, 6px above and below, the 12px chevron at the end.
function ToolCall({ name, state = "completed", duration, icon = CodeIcon, className, children, ...props }: ToolCallProps) {
  return (
    <CollapsiblePrimitive.Root data-slot="tool-call" data-status={state} className={cn("group/tool-call w-full min-w-0", className)} {...props}>
      <CollapsiblePrimitive.Trigger
        data-slot="tool-call-trigger"
        className="flex w-full items-center gap-2 rounded-(--radius-sm) py-1.5 text-start text-[14px] leading-[20px] text-text-1 outline-none hover:text-link focus-visible:shadow-(--focus-ring)"
      >
        {state === "running" ? <RunStateIcon state="running" /> : <Icon icon={icon} size="sm" className="text-text-3" />}
        <span className="min-w-0 truncate font-medium">{name}</span>
        <RunMeta state={state} duration={duration} />
        <Icon
          icon={ArrowDown01Icon}
          size="sm"
          className="ms-auto size-3 text-text-3 transition-transform duration-(--dur-fast) group-data-[state=open]/tool-call:rotate-180"
        />
      </CollapsiblePrimitive.Trigger>
      <CollapsiblePrimitive.Content data-slot="tool-call-content" className="overflow-hidden">
        <div className="ms-2 flex flex-col gap-2 border-s border-border py-1 ps-4">
          {children ?? <p className="text-[12px] leading-[16px] text-text-3">No output yet.</p>}
        </div>
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  );
}

const show = (value: unknown) => (typeof value === "string" ? value : JSON.stringify(value, null, 2));

type ToolCallBlockProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** A string, or any value: objects print as indented JSON. */
  value: unknown;
};

function block(slot: string, label: string, tone: string) {
  function ToolCallBlock({ value, className, ...props }: ToolCallBlockProps) {
    return (
      <div data-slot={slot} className={cn("flex flex-col gap-1", className)} {...props}>
        <span className="text-[12px] leading-[16px] font-medium text-text-2">{label}</span>
        <pre className={cn("overflow-x-auto rounded-(--radius-md) px-3 py-2 font-mono text-[12px] leading-[16px] whitespace-pre-wrap break-words", tone)}>
          {show(value)}
        </pre>
      </div>
    );
  }
  return ToolCallBlock;
}

/** What the agent sent the tool. */
const ToolCallInput = block("tool-call-input", "Input", "bg-surface-2 text-text-2");
/** What the tool sent back. */
const ToolCallOutput = block("tool-call-output", "Output", "bg-surface-2 text-text-2");
/** Why the call failed. */
const ToolCallError = block("tool-call-error", "Error", "bg-danger-soft text-danger");

export { RUN_STATE_LABEL, RunMeta, RunStateIcon, ToolCall, ToolCallError, ToolCallInput, ToolCallOutput, type RunState };
