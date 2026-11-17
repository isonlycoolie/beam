import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@beam/ui/components/tooltip";
import { Icon } from "@beam/ui/icons";

export default function TooltipDefault() {
  return (
    <TooltipProvider>
      <p className="flex items-center gap-1.5 text-[14px] leading-[20px] text-text-1">
        Calculate tax
        <Tooltip>
          <TooltipTrigger className="text-text-3">
            <Icon icon={InformationCircleIcon} size="sm" label="About tax" />
          </TooltipTrigger>
          <TooltipContent>Uses the customer's shipping address</TooltipContent>
        </Tooltip>
      </p>
    </TooltipProvider>
  );
}
