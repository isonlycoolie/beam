import { Bubble, BubbleContent, BubbleGroup } from "@beam/ui/components/bubble";

export default function BubbleDefault() {
  return (
    <BubbleGroup className="w-[420px]">
      <Bubble>
        <BubbleContent>Can I refund only part of this payment?</BubbleContent>
      </Bubble>
      <Bubble align="end" variant="secondary">
        <BubbleContent>Yes. Open the payment and choose Refund, then enter the amount.</BubbleContent>
      </Bubble>
    </BubbleGroup>
  );
}
