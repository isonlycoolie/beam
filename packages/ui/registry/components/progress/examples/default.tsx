import { Progress } from "@beam/ui/components/progress";

export default function ProgressDefault() {
  return (
    <div className="flex w-[278px] flex-col gap-2">
      <span className="text-[12px] leading-[16px] text-text-1">Usage meter</span>
      <Progress value={83} aria-label="Usage" />
    </div>
  );
}
