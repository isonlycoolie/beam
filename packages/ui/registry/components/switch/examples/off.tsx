import { Label } from "@beam/ui/components/label";
import { Switch } from "@beam/ui/components/switch";

export default function SwitchOff() {
  return (
    <div className="flex w-[316px] items-center justify-between">
      <Label htmlFor="recurring" className="text-[14px] leading-[20px] font-normal text-text-1">Recurring payment</Label>
      <Switch id="recurring" />
    </div>
  );
}
