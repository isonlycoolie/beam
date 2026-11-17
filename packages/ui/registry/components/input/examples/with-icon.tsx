import { Search01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@beam/ui/icons";
import { Input } from "@beam/ui/components/input";

export default function InputWithIcon() {
  return (
    <div className="relative max-w-xs">
      <Icon icon={Search01Icon} size="sm" className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-text-3" />
      <Input className="ps-9" placeholder="Search invoices" aria-label="Search invoices" />
    </div>
  );
}
