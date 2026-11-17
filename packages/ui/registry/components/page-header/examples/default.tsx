import { Add01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@beam/ui/icons";
import { Button } from "@beam/ui/components/button";
import { PageHeader } from "@beam/ui/components/page-header";

export default function PageHeaderDefault() {
  return (
    <PageHeader
      className="w-full"
      eyebrow="Billing"
      title="Invoices"
      description="Send invoices and track what has been paid."
      actions={
        <>
          <Button variant="outline">Export</Button>
          <Button>
            <Icon icon={Add01Icon} size="sm" /> New invoice
          </Button>
        </>
      }
    />
  );
}
