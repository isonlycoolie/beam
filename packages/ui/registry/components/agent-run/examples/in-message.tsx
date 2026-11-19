import { Search01Icon } from "@hugeicons/core-free-icons";
import { AgentRun, AgentRunStep } from "@beam/ui/components/agent-run";
import { Bubble, BubbleContent } from "@beam/ui/components/bubble";
import { Message, MessageContent, MessageHeader } from "@beam/ui/components/message";
import { ToolCall, ToolCallOutput } from "@beam/ui/components/tool-call";

export default function AgentRunInMessage() {
  return (
    <Message className="w-[460px]">
      <MessageContent>
        <MessageHeader>Agent, 10:42</MessageHeader>
        <AgentRun title="Find failed payouts" state="completed" duration="6s">
          <AgentRunStep>Read last week's payouts</AgentRunStep>
          <ToolCall name="Search payouts" duration="1.4s" icon={Search01Icon}>
            <ToolCallOutput value={{ failed: 2, total: 148 }} />
          </ToolCall>
          <AgentRunStep>Check the bank replies</AgentRunStep>
        </AgentRun>
        <Bubble>
          <BubbleContent>Two payouts failed last week. Both went to closed accounts; I drafted an email to each owner.</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  );
}
