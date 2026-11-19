import { FileEditIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { ToolCall, ToolCallError, ToolCallInput, ToolCallOutput } from "@beam/ui/components/tool-call";

export default function ToolCallDefault() {
  return (
    <div className="flex w-[420px] flex-col">
      <ToolCall name="Read project" state="completed" duration="1.2s">
        <ToolCallOutput value="Project loaded." />
      </ToolCall>
      <ToolCall name="Search files" state="running" icon={Search01Icon} />
      <ToolCall name="Write file" state="failed" duration="0.4s" icon={FileEditIcon} defaultOpen>
        <ToolCallInput value={{ path: "src/app.ts" }} />
        <ToolCallError value="Permission denied." />
      </ToolCall>
    </div>
  );
}
