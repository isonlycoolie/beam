import { StatCardSkeleton } from "@beam/ui/components/stat-card";

export default function StatCardLoading() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>
  );
}
