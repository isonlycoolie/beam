import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@beam/ui/components/command";

export default function CommandDefault() {
  return (
    <Command className="w-[420px] rounded-(--radius-card) border border-border">
      <CommandInput placeholder="Search payments, customers, docs" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Go to">
          <CommandItem>Payments</CommandItem>
          <CommandItem>Customers</CommandItem>
          <CommandItem>Payouts</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
