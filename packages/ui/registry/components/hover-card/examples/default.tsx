import { HoverCard, HoverCardContent, HoverCardTrigger } from "@beam/ui/components/hover-card";

export default function HoverCardDefault() {
  return (
    <HoverCard>
      <HoverCardTrigger href="#" className="text-[14px] font-medium text-link">cus_NffrFeUfNV2Hib</HoverCardTrigger>
      <HoverCardContent>
        <p className="text-[14px] leading-[20px] font-semibold text-text-1">Jenny Rosen</p>
        <p className="text-[14px] leading-[20px] text-text-2">jenny.rosen@example.com</p>
      </HoverCardContent>
    </HoverCard>
  );
}
