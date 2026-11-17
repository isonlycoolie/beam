import { Label } from "@beam/ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@beam/ui/components/select";

export default function SelectDefault() {
  return (
    <div className="flex w-[316px] items-center justify-between">
      <Label className="text-[14px] leading-[20px] font-normal text-text-1">Button text</Label>
      <Select defaultValue="pay">
        <SelectTrigger aria-label="Button text">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pay">Pay</SelectItem>
          <SelectItem value="book">Book</SelectItem>
          <SelectItem value="donate">Donate</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
