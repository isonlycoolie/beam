import { ScrollArea } from "@beam/ui/components/scroll-area";

export default function ScrollAreaDefault() {
  return (
    <ScrollArea className="h-40 w-[260px] rounded-(--radius-card) border border-border">
      <ul className="p-3 text-[14px] leading-[24px] text-text-1">
        {Array.from({ length: 20 }, (_, i) => (
          <li key={i}>Invoice INV-{1040 + i}</li>
        ))}
      </ul>
    </ScrollArea>
  );
}
