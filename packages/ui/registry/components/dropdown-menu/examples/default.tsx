import { Button } from "@beam/ui/components/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@beam/ui/components/dropdown-menu";

export default function DropdownMenuDefault() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Invoice</DropdownMenuLabel>
        <DropdownMenuItem>Duplicate <DropdownMenuShortcut>Ctrl D</DropdownMenuShortcut></DropdownMenuItem>
        <DropdownMenuItem>Download PDF</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Void invoice</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
