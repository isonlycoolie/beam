import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@beam/ui/components/resizable";

export default function ResizableDefault() {
  return (
    <ResizablePanelGroup orientation="horizontal" className="h-40 w-[480px] rounded-(--radius-card) border border-border">
      <ResizablePanel defaultSize="40%" className="grid place-items-center text-[14px] text-text-2">List</ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="60%" className="grid place-items-center text-[14px] text-text-2">Details</ResizablePanel>
    </ResizablePanelGroup>
  );
}
