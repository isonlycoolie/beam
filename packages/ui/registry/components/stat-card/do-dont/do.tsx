import { StatCard } from "@beam/ui/components/stat-card";

/** Five metrics, five columns: every row is full (rule grid.no-orphans). */
export default function StatCardDo() {
  return (
    <div className="grid w-full grid-cols-5 gap-3 [&_[data-slot=stat-card]]:p-3.5">
      <StatCard label="Revenue" value="48.2m" />
      <StatCard label="Orders" value="1,204" />
      <StatCard label="Customers" value="2,184" />
      <StatCard label="Refunds" value="32" />
      <StatCard label="Churn" value="1.8%" />
    </div>
  );
}
