import { Slider } from "@beam/ui/components/slider";

export default function SliderDefault() {
  return (
    <Slider defaultValue={[40]} max={100} step={5} className="w-[278px]" aria-label="Refund amount" />
  );
}
