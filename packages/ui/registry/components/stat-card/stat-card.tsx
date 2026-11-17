/* Beam UI. One metric with its change over a period. Its skeleton has the same layout, so loading never shifts. */
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import type * as React from "react";
import { Icon } from "../../../icons/icon";
import { cn } from "../../../lib/cn";
import { Skeleton } from "../skeleton";

/** Labels longer than this wrap and break the row's balance (rules copy.length-caps, copy.sibling-parity). */
export const STAT_LABEL_MAX = 24;

type StatCardProps = Omit<React.ComponentProps<"div">, "children"> & {
  label: string;
  value: React.ReactNode;
  unit?: string;
  /** Change versus the comparison period, in percent. */
  delta?: number;
  /** For metrics where down is good (costs, churn, response time). */
  invertDelta?: boolean;
  period?: string;
};

function StatCard({ label, value, unit, delta, invertDelta = false, period, className, ...props }: StatCardProps) {
  const up = (delta ?? 0) >= 0;
  const good = invertDelta ? !up : up;
  return (
    <div data-slot="stat-card" className={cn("flex flex-col gap-3 rounded-(--radius-lg) border border-border bg-card p-5 shadow-(--shadow-1)", className)} {...props}>
      <p className="truncate text-small text-text-2" title={label.length > STAT_LABEL_MAX ? label : undefined}>
        {label}
      </p>
      <p className="text-h2 text-numeric text-text-1">
        {value}
        {unit && <span className="ms-1 text-small font-normal text-text-2">{unit}</span>}
      </p>
      {delta !== undefined && (
        <p className="flex items-center gap-1.5 text-caption">
          <span className={cn("inline-flex items-center gap-0.5 font-semibold", good ? "text-success" : "text-danger")}>
            <Icon icon={up ? ArrowUp01Icon : ArrowDown01Icon} size="sm" />
            <span className="sr-only">{up ? "Up" : "Down"}</span>
            {Math.abs(delta).toFixed(1)}%
          </span>
          {period && <span className="text-text-3">vs {period}</span>}
        </p>
      )}
    </div>
  );
}

/** Same box, same rows, same heights as a loaded StatCard (rule skeleton.fidelity). */
function StatCardSkeleton({ withDelta = true, className }: { withDelta?: boolean; className?: string }) {
  return (
    <div data-slot="stat-card" aria-busy className={cn("flex flex-col gap-3 rounded-(--radius-lg) border border-border bg-card p-5 shadow-(--shadow-1)", className)}>
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-8 w-24" />
      {withDelta && <Skeleton className="h-4 w-32" />}
    </div>
  );
}

export { StatCard, StatCardSkeleton, type StatCardProps };
