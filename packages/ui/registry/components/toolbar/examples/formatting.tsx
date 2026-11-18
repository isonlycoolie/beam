import { TextBoldIcon, TextItalicIcon, TextUnderlineIcon } from "@hugeicons/core-free-icons";
import { Toolbar, ToolbarButton, ToolbarSeparator, ToolbarToggleGroup, ToolbarToggleItem } from "@beam/ui/components/toolbar";
import { Icon } from "@beam/ui/icons";

export default function ToolbarFormatting() {
  return (
    <Toolbar aria-label="Text formatting">
      <ToolbarToggleGroup type="multiple" defaultValue={["bold"]} aria-label="Text style">
        <ToolbarToggleItem size="icon" value="bold" aria-label="Bold">
          <Icon icon={TextBoldIcon} size="sm" />
        </ToolbarToggleItem>
        <ToolbarToggleItem size="icon" value="italic" aria-label="Italic">
          <Icon icon={TextItalicIcon} size="sm" />
        </ToolbarToggleItem>
        <ToolbarToggleItem size="icon" value="underline" aria-label="Underline">
          <Icon icon={TextUnderlineIcon} size="sm" />
        </ToolbarToggleItem>
      </ToolbarToggleGroup>
      <ToolbarSeparator />
      <ToolbarButton>Clear</ToolbarButton>
    </Toolbar>
  );
}
