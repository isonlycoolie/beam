import { StatCard } from "@beam/ui/components/stat-card";

export default function StatCardRow() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      <StatCard label="Monthly revenue" value="TZS 48.2m" delta={12.4} period="last month" />
      <StatCard label="Active customers" value="2,184" delta={4.1} period="last month" />
      <StatCard label="Churn rate" value="1.8" unit="%" delta={-0.6} invertDelta period="last month" />
    </div>
  );
}
