/* Anatomy from Sesama UI's agent workspace (MIT), built from Beam components and tokens. */
import { FileEditIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { AgentRun, AgentRunStep, AgentRunThinking } from "@beam/ui/components/agent-run";
import { Bubble, BubbleContent } from "@beam/ui/components/bubble";
import { Message, MessageContent, MessageHeader } from "@beam/ui/components/message";
import { ToolCall, ToolCallInput, ToolCallOutput } from "@beam/ui/components/tool-call";

// One finished task and one in progress: the agent's work sits above its reply, in the same message.
export function Conversation() {
  return (
    <>
      <Message align="end">
        <MessageContent>
          <Bubble align="end">
            <BubbleContent>Which payouts failed last week, and why?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent className="w-full max-w-[560px]">
          <MessageHeader>Agent, 10:42</MessageHeader>
          <AgentRun title="Find failed payouts" state="completed" duration="6s">
            <AgentRunStep>Read last week's payouts</AgentRunStep>
            <ToolCall name="Search payouts" duration="1.4s" icon={Search01Icon}>
              <ToolCallInput value={{ status: "failed", from: "2026-11-09", to: "2026-11-15" }} />
              <ToolCallOutput value={{ failed: 2, total: 148 }} />
            </ToolCall>
            <AgentRunStep>Check the bank replies</AgentRunStep>
          </AgentRun>
          <Bubble>
            <BubbleContent>Two of 148 payouts failed. Both went to accounts the banks have closed.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble align="end">
            <BubbleContent>Draft an email to each owner asking for new bank details.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent className="w-full max-w-[560px]">
          <MessageHeader>Agent, 10:44</MessageHeader>
          <AgentRun title="Draft owner emails" state="running" defaultOpen>
            <AgentRunStep>Look up both owners</AgentRunStep>
            <AgentRunThinking>Both owners write in English; keep it short and link to the bank details form.</AgentRunThinking>
            <ToolCall name="Write draft" state="running" icon={FileEditIcon} />
            <AgentRunStep state="queued">Save the drafts</AgentRunStep>
          </AgentRun>
        </MessageContent>
      </Message>
    </>
  );
}
