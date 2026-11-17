import { Invoice01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@beam/ui/components/button";
import { EmptyState } from "@beam/ui/components/empty-state";

export default function EmptyStateDefault() {
  return (
    <EmptyState
      bordered
      className="w-full max-w-md"
      icon={Invoice01Icon}
      title="No invoices yet"
      description="Invoices you send appear here with their payment status."
      action={<Button>Create invoice</Button>}
      secondary={<a className="underline underline-offset-4" href="#">How invoicing works</a>}
    />
  );
}
