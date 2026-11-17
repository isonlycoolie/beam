import { StatCard } from "@beam/ui/components/stat-card";

/** Four in a row and one left alone below: the empty space breaks the page. */
export default function StatCardDont() {
  return (
    <div className="grid w-full grid-cols-4 gap-3 [&_[data-slot=stat-card]]:p-3.5">
      <StatCard label="Revenue" value="48.2m" />
      <StatCard label="Orders" value="1,204" />
      <StatCard label="Customers" value="2,184" />
      <StatCard label="Refunds" value="32" />
      <StatCard label="Churn" value="1.8%" />
    </div>
  );
}
