import { LiquidGlass } from "@beam/ui/components/liquid-glass";

/** A liquid glass pill over a photo: move the pointer over it to see the rim catch the light. */
export default function LiquidGlassDefault() {
  return (
    <div
      className="relative flex h-[320px] w-full max-w-[560px] items-center justify-center overflow-hidden rounded-[16px] bg-cover bg-center"
      style={{ backgroundImage: "url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=70&auto=format)" }}
    >
      <LiquidGlass className="px-8 py-5">
        <span className="text-[17px] leading-[22px] font-semibold text-white [text-shadow:0_2px_12px_rgb(0_0_0/0.4)]">Liquid glass</span>
      </LiquidGlass>
    </div>
  );
}
