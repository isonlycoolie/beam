import { Button } from "@beam/ui/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@beam/ui/components/popover";

export default function PopoverDefault() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Tax details</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-[14px] leading-[20px] text-text-2">Tax is calculated from the shipping address at checkout.</p>
      </PopoverContent>
    </Popover>
  );
}
