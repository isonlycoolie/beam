import { Add01Icon, FilterHorizontalIcon, MinusSignIcon } from "@hugeicons/core-free-icons";
import { Toolbar, ToolbarButton, ToolbarSeparator } from "@beam/ui/components/toolbar";
import { Icon } from "@beam/ui/icons";

export default function ToolbarDefault() {
  return (
    <Toolbar aria-label="Table controls">
      <ToolbarButton>
        <Icon icon={FilterHorizontalIcon} size="sm" />
        Filter
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton size="icon" aria-label="Add row">
        <Icon icon={Add01Icon} size="sm" />
      </ToolbarButton>
      <ToolbarButton size="icon" aria-label="Remove row">
        <Icon icon={MinusSignIcon} size="sm" />
      </ToolbarButton>
    </Toolbar>
  );
}
