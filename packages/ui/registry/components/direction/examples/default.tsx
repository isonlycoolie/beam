import { DirectionProvider } from "@beam/ui/components/direction";

export default function DirectionDefault() {
  return (
    <DirectionProvider dir="rtl">
      <p className="text-[14px] text-text-1">مرحبا</p>
    </DirectionProvider>
  );
}
