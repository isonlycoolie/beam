import { Checkbox } from "@beam/ui/components/checkbox";
import { Label } from "@beam/ui/components/label";

export default function CheckboxDefault() {
  return (
    <div className="flex items-center gap-3">
      <Checkbox id="same" defaultChecked />
      <Label htmlFor="same" className="text-[16px] leading-[20.8px] font-normal text-text-1">Billing info is same as shipping</Label>
    </div>
  );
}
