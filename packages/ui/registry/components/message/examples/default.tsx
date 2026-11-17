import { Bubble, BubbleContent } from "@beam/ui/components/bubble";
import { Message, MessageContent, MessageHeader } from "@beam/ui/components/message";

export default function MessageDefault() {
  return (
    <Message className="w-[420px]">
      <MessageContent>
        <MessageHeader>Support, 10:42</MessageHeader>
        <Bubble>
          <BubbleContent>Your payout is on its way and should arrive tomorrow.</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  );
}
