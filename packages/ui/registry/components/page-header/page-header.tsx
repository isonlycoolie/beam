/* Beam UI. Every page starts the same way: where you are, what this is, and the one main action. */
import type * as React from "react";
import { cn } from "../../../lib/cn";

type PageHeaderProps = Omit<React.ComponentProps<"header">, "title"> & {
  title: string;
  /** One line (rule copy.length-caps). */
  description?: string;
  /** Breadcrumbs or a back link above the title. */
  eyebrow?: React.ReactNode;
  /** The page's one primary action, plus at most one secondary (rule action.one-primary). */
  actions?: React.ReactNode;
};

function PageHeader({ title, description, eyebrow, actions, className, ...props }: PageHeaderProps) {
  return (
    <header data-slot="page-header" className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)} {...props}>
      <div className="flex min-w-0 flex-col gap-1">
        {eyebrow && <div className="mb-1 text-small text-text-2">{eyebrow}</div>}
        <h1 className="text-h1 text-text-1">{title}</h1>
        {description && <p className="text-body text-text-2">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}

export { PageHeader, type PageHeaderProps };
