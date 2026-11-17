import { StatCard } from "@beam/ui/components/stat-card";

export default function StatCardDefault() {
  return <StatCard className="w-full max-w-xs" label="Monthly revenue" value="TZS 48.2m" delta={12.4} period="last month" />;
}
