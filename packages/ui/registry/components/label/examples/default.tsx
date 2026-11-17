import { Input } from "@beam/ui/components/input";
import { Label } from "@beam/ui/components/label";

export default function LabelDefault() {
  return (
    <div className="flex max-w-xs flex-col gap-1.5">
      <Label htmlFor="company">Company name</Label>
      <Input id="company" placeholder="Acme Ltd" />
    </div>
  );
}
