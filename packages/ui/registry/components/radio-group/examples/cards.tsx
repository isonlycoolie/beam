import { RadioCard, RadioGroup } from "@beam/ui/components/radio-group";

export default function RadioGroupCards() {
  return (
    <RadioGroup defaultValue="tzs" aria-label="Currency" className="w-[380px] grid-cols-2">
      <RadioCard value="tzs">TZS 78,800.08</RadioCard>
      <RadioCard value="usd">US$28.80</RadioCard>
    </RadioGroup>
  );
}
