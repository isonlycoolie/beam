import { Add01Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@beam/ui/icons";
import { Button } from "@beam/ui/components/button";

export default function ButtonWithIcon() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <Icon icon={Add01Icon} size="sm" /> New project
      </Button>
      <Button variant="outline" size="icon" aria-label="Open in a new tab">
        <Icon icon={ArrowUpRight01Icon} size="sm" />
      </Button>
    </div>
  );
}
