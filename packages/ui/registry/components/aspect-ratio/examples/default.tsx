import { AspectRatio } from "@beam/ui/components/aspect-ratio";

export default function AspectRatioDefault() {
  return (
    <div className="w-[320px]">
      <AspectRatio ratio={16 / 9} className="grid place-items-center rounded-(--radius-card) bg-surface-2 text-[14px] text-text-3">
        16 : 9
      </AspectRatio>
    </div>
  );
}
