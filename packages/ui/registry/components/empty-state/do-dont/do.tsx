import { Invoice01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@beam/ui/components/button";
import { EmptyState } from "@beam/ui/components/empty-state";

/** Says what will appear here and offers the one next step (rule empty.actionable). */
export default function EmptyStateDo() {
  return <EmptyState icon={Invoice01Icon} title="No invoices yet" description="Invoices you send appear here." action={<Button size="sm">Create invoice</Button>} />;
}
