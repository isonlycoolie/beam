import { Search01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@beam/ui/components/button";
import { EmptyState } from "@beam/ui/components/empty-state";

export default function EmptyStateNoResults() {
  return (
    <EmptyState
      className="w-full max-w-md"
      icon={Search01Icon}
      title="No matches for \u201cnairobi\u201d"
      description="Try a shorter search or clear the filters."
      action={<Button variant="outline">Clear filters</Button>}
    />
  );
}
