import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@beam/ui/components/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@beam/ui/components/collapsible";
import { Icon } from "@beam/ui/icons";

export default function CollapsibleDefault() {
  return (
    <Collapsible defaultOpen className="flex w-[320px] flex-col gap-2">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="justify-between">
          Shipping address <Icon icon={ArrowDown01Icon} size="sm" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-(--radius-card) border border-border p-4 text-[14px] leading-[20px] text-text-2">
        12 Ocean Road, Dar es Salaam, Tanzania
      </CollapsibleContent>
    </Collapsible>
  );
}
