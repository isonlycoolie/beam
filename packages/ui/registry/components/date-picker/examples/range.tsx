import { DatePicker } from "@beam/ui/components/date-picker";
import { Label } from "@beam/ui/components/label";

export default function DatePickerRange() {
  return (
    <div className="flex w-[300px] flex-col gap-2">
      <Label htmlFor="period">Period</Label>
      <DatePicker id="period" mode="range" className="w-full" defaultValue={{ from: new Date(2026, 10, 3), to: new Date(2026, 10, 18) }} />
    </div>
  );
}
