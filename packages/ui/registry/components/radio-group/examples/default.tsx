import { Label } from "@beam/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@beam/ui/components/radio-group";

export default function RadioGroupDefault() {
  return (
    <RadioGroup defaultValue="monthly" aria-label="Billing period">
      {([["monthly", "Monthly"], ["yearly", "Yearly"]] as const).map(([value, label]) => (
        <div key={value} className="flex items-center gap-3">
          <RadioGroupItem value={value} id={value} />
          <Label htmlFor={value} className="text-[14px] leading-[20px] font-normal text-text-1">{label}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}
