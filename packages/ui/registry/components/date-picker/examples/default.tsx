import { DatePicker } from "@beam/ui/components/date-picker";
import { Label } from "@beam/ui/components/label";

export default function DatePickerDefault() {
  return (
    <div className="flex w-[260px] flex-col gap-2">
      <Label htmlFor="due">Due date</Label>
      <DatePicker id="due" className="w-full" defaultValue={new Date(2026, 10, 18)} />
    </div>
  );
}
