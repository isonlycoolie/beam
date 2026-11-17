import { Label } from "@beam/ui/components/label";
import { Switch } from "@beam/ui/components/switch";

export default function SwitchDefault() {
  return (
    <div className="flex w-[316px] items-center justify-between">
      <Label htmlFor="one-time" className="text-[14px] leading-[20px] font-normal text-text-1">One-time payment</Label>
      <Switch id="one-time" defaultChecked />
    </div>
  );
}
