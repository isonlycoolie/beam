import { Separator } from "@beam/ui/components/separator";

export default function SeparatorDefault() {
  return (
    <div className="w-[320px] text-[14px] leading-[20px] text-text-1">
      <p>Subtotal</p>
      <Separator className="my-3" />
      <p>Total due</p>
    </div>
  );
}
