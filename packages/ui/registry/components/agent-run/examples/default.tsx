import { Search01Icon } from "@hugeicons/core-free-icons";
import { AgentRun, AgentRunStep, AgentRunThinking } from "@beam/ui/components/agent-run";
import { ToolCall, ToolCallOutput } from "@beam/ui/components/tool-call";

export default function AgentRunDefault() {
  return (
    <div className="flex w-[440px] flex-col gap-3">
      <AgentRun title="Review project" state="completed" duration="12s" />
      <AgentRun title="Review project" state="running" defaultOpen>
        <AgentRunStep>Read the brief</AgentRunStep>
        <AgentRunThinking defaultOpen>Comparing the brief with the current layout.</AgentRunThinking>
        <ToolCall name="Search files" duration="0.8s" icon={Search01Icon}>
          <ToolCallOutput value="3 matches" />
        </ToolCall>
        <AgentRunStep state="running">Draft the changes</AgentRunStep>
      </AgentRun>
    </div>
  );
}
