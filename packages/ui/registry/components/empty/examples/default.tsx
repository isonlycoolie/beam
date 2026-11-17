import { Invoice01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@beam/ui/components/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@beam/ui/components/empty";
import { Icon } from "@beam/ui/icons";

export default function EmptyDefault() {
  return (
    <Empty className="w-[480px]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon icon={Invoice01Icon} />
        </EmptyMedia>
        <EmptyTitle>No invoices yet</EmptyTitle>
        <EmptyDescription>Invoices you send appear here with their status.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Create invoice</Button>
      </EmptyContent>
    </Empty>
  );
}
