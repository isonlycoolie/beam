import { Label } from "@beam/ui/components/label";
import { Textarea } from "@beam/ui/components/textarea";

export default function TextareaDefault() {
  return (
    <div className="flex w-[378px] flex-col gap-1">
      <Label htmlFor="note">Order note</Label>
      <Textarea id="note" placeholder="Leave at the front desk" />
    </div>
  );
}
