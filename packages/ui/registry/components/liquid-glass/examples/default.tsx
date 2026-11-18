import { LiquidGlass } from "@beam/ui/components/liquid-glass";

/** A liquid glass pill over a photo: the rim bends the photo behind it. Press it. */
export default function LiquidGlassDefault() {
  return (
    <div
      className="relative flex h-[320px] w-full max-w-[560px] items-center justify-center overflow-hidden rounded-[16px] bg-cover bg-center"
      style={{ backgroundImage: "url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1120&q=55&auto=format&fit=crop)" }}
    >
      <LiquidGlass pressable className="px-8 py-5">
        <span className="text-[17px] leading-[22px] font-semibold text-text-1">Liquid glass</span>
      </LiquidGlass>
    </div>
  );
}
