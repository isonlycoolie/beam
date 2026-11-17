"use client";

import { Bubble, BubbleContent } from "@beam/ui/components/bubble";
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from "@beam/ui/components/message-scroller";

export default function MessageScrollerDefault() {
  return (
    <MessageScrollerProvider>
      <MessageScroller className="h-56 w-[420px] rounded-(--radius-card) border border-border">
        <MessageScrollerViewport>
          <MessageScrollerContent className="flex flex-col gap-2 p-3">
            {Array.from({ length: 12 }, (_, i) => (
              <MessageScrollerItem key={i}>
                <Bubble align={i % 2 ? "end" : "start"}>
                  <BubbleContent>Message {i + 1}</BubbleContent>
                </Bubble>
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  );
}
