import { StatusDot } from "@beam/ui/components/status-dot";

export default function StatusDotVariants() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <StatusDot>Idle</StatusDot>
      <StatusDot variant="info">Queued</StatusDot>
      <StatusDot variant="success">Online</StatusDot>
      <StatusDot variant="warning">Degraded</StatusDot>
      <StatusDot variant="danger">Failed</StatusDot>
      <StatusDot variant="disabled">Paused</StatusDot>
      <StatusDot variant="success" label="Online" />
    </div>
  );
}
