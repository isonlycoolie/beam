import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@beam/ui/components/context-menu";

export default function ContextMenuDefault() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="grid h-32 w-72 place-items-center rounded-(--radius-card) border border-dashed border-input text-[14px] text-text-2">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Copy link</ContextMenuItem>
        <ContextMenuItem>Rename</ContextMenuItem>
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
