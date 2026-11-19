/* Anatomy and keyboard from Sesama UI (MIT); built from Beam's Input Group, Textarea and Button (see CREDITS.md). */
"use client";

import { ArrowUp02Icon, StopIcon } from "@hugeicons/core-free-icons";
import * as React from "react";
import { Icon } from "../../../icons/icon";
import { cn } from "../../../lib/cn";
import { Button } from "../button/button";
import { GlassBackdrop } from "../liquid-glass/liquid-glass";

type ComposerStatus = "idle" | "running";

type ComposerContextValue = {
  value: string;
  setValue: (value: string) => void;
  status: ComposerStatus;
  canSubmit: boolean;
  onStop?: () => void;
};

const ComposerContext = React.createContext<ComposerContextValue | null>(null);

function useComposer() {
  const context = React.useContext(ComposerContext);
  if (!context) throw new Error("Composer parts must sit inside <Composer>.");
  return context;
}

/** Enter sends; Shift+Enter makes a new line, and nothing sends while an input method is still composing a word. */
function isSubmitKey(event: Pick<KeyboardEvent, "key" | "shiftKey" | "isComposing">) {
  return event.key === "Enter" && !event.shiftKey && !event.isComposing;
}

type ComposerProps = Omit<React.ComponentProps<"form">, "onSubmit"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called with the trimmed message. Uncontrolled composers clear themselves after. */
  onSubmit?: (message: string) => void;
  /** While "running" the send button turns into Stop. */
  status?: ComposerStatus;
  onStop?: () => void;
  /** Lets an empty message send, e.g. when files are attached. */
  hasAttachments?: boolean;
};

// The prompt card: Input Group's field (card, field shadow, focus ring on the whole card) at the 12px card radius.
function Composer({ value: valueProp, defaultValue = "", onValueChange, onSubmit, status = "idle", onStop, hasAttachments = false, className, children, ...props }: ComposerProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : inner;
  const setValue = React.useCallback(
    (next: string) => {
      if (!controlled) setInner(next);
      onValueChange?.(next);
    },
    [controlled, onValueChange],
  );
  const canSubmit = status === "idle" && (value.trim().length > 0 || hasAttachments);

  return (
    <ComposerContext.Provider value={{ value, setValue, status, canSubmit, onStop }}>
      <form
        data-slot="composer"
        data-status={status}
        className={cn(
          "relative flex w-full min-w-0 flex-col rounded-(--radius-xl) bg-card text-text-1 shadow-(--shadow-1)",
          "transition-shadow duration-(--dur-fast) has-[textarea:focus-visible]:shadow-(--focus-ring)",
          className,
        )}
        onSubmit={(event) => {
          event.preventDefault();
          if (!canSubmit) return;
          onSubmit?.(value.trim());
          if (!controlled) setInner("");
        }}
        {...props}
      >
        <GlassBackdrop />
        {children}
