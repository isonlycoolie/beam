import { ToolCall, ToolCallInput, ToolCallOutput } from "@beam/ui/components/tool-call";

export default function ToolCallOutputExample() {
  return (
    <ToolCall name="Read project" state="completed" duration="1.2s" defaultOpen className="w-[420px]">
      <ToolCallInput value={{ id: 42 }} />
      <ToolCallOutput value={{ ok: true, files: 12 }} />
    </ToolCall>
  );
}
