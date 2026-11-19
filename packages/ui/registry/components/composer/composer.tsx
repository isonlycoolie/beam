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
      </form>
    </ComposerContext.Provider>
  );
}

// Files waiting to send: two Attachments a row, four from 600px.
function ComposerAttachments({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="composer-attachments" className={cn("grid grid-cols-2 gap-2 px-3 pt-3 min-[600px]:grid-cols-4 empty:hidden", className)} {...props} />;
}

// Grows with the text from 56px to 240px (or a third of a short screen), then scrolls.
function ComposerInput({ className, onKeyDown, ...props }: Omit<React.ComponentProps<"textarea">, "value" | "defaultValue">) {
  const { value, setValue } = useComposer();
  return (
    <textarea
      data-slot="composer-input"
      aria-label={props["aria-label"] ?? "Message"}
      rows={1}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || !isSubmitKey({ key: event.key, shiftKey: event.shiftKey, isComposing: event.nativeEvent.isComposing })) return;
        event.preventDefault();
        event.currentTarget.form?.requestSubmit();
      }}
      className={cn(
        "field-sizing-content max-h-[min(240px,35dvh)] min-h-14 w-full resize-none bg-transparent px-3 pt-3 pb-1",
        "text-[14px] leading-[20px] text-text-1 outline-none placeholder:text-text-3 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

// The bar under the text: actions start left; push the rest right with ms-auto on the first of them.
function ComposerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="composer-footer" className={cn("flex items-center gap-1 p-2", className)} {...props} />;
}

/** An icon action in the bar (attach, microphone): a ghost Button at 28px. Give it an aria-label. */
function ComposerAction({ variant = "ghost", size = "icon-sm", ...props }: React.ComponentProps<typeof Button>) {
  return <Button data-slot="composer-action" type="button" variant={variant} size={size} {...props} />;
}

// Send, the one primary Button; Stop takes its place while the reply runs.
function ComposerSubmit({ className, ...props }: Omit<React.ComponentProps<typeof Button>, "children">) {
  const { status, canSubmit, onStop } = useComposer();
  if (status === "running")
    return (
      <Button type="button" size="icon-sm" aria-label="Stop" onClick={onStop} className={className} {...props}>
        <Icon icon={StopIcon} size="sm" />
      </Button>
    );
  return (
    <Button type="submit" size="icon-sm" aria-label="Send" disabled={!canSubmit} className={className} {...props}>
      <Icon icon={ArrowUp02Icon} size="sm" />
    </Button>
  );
}

export { Composer, ComposerAction, ComposerAttachments, ComposerFooter, ComposerInput, ComposerSubmit, isSubmitKey, useComposer };
