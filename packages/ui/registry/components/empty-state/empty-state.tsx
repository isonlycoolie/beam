/* Beam UI. What will appear here, and the one step that makes it appear. */
import { InboxIcon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import type * as React from "react";
import { Icon } from "../../../icons/icon";
import { cn } from "../../../lib/cn";

type EmptyStateProps = Omit<React.ComponentProps<"div">, "title"> & {
  icon?: IconSvgElement;
  /** Or a full illustration instead of the icon. */
  illustration?: React.ReactNode;
  title: string;
  /** One sentence (rule copy.length-caps). */
  description?: string;
  /** One primary action (rule empty.actionable). */
  action?: React.ReactNode;
  /** An optional quiet link, for example to the docs. */
  secondary?: React.ReactNode;
  bordered?: boolean;
};

function EmptyState({ icon = InboxIcon, illustration, title, description, action, secondary, bordered = false, className, ...props }: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center px-6 py-12 text-center",
        bordered && "rounded-lg border border-dashed border-border",
        className,
      )}
      {...props}
    >
      {illustration ?? (
        <span className="grid size-12 place-items-center rounded-full bg-surface-2 text-text-2 ring-1 ring-inset ring-border">
          <Icon icon={icon} size="lg" />
        </span>
      )}
      <h3 className="mt-4 text-h3 text-text-1">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-small text-text-2">{description}</p>}
      {(action || secondary) && (
        <div className="mt-5 flex flex-col items-center gap-3">
          {action}
          {secondary && <div className="text-small text-text-2">{secondary}</div>}
        </div>
      )}
    </div>
  );
}

export { EmptyState, type EmptyStateProps };
