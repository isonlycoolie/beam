import { Kbd } from "@beam/ui/components/kbd";

export default function KbdDefault() {
  return (
    <p className="flex items-center gap-2 text-[14px] leading-[20px] text-text-2">
      Search <Kbd>/</Kbd> or <Kbd>Ctrl</Kbd><Kbd>K</Kbd>
    </p>
  );
}
