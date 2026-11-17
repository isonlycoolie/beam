import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type { SVGProps } from "react";
import { cn } from "../lib/cn";

/** Icon sizes and the stroke that keeps each one optically even. Icons follow the text colour. */
export const ICON_SIZES = {
  sm: { size: 16, strokeWidth: 1.75 },
  md: { size: 20, strokeWidth: 1.75 },
  lg: { size: 24, strokeWidth: 1.5 },
} as const;

export type IconSize = keyof typeof ICON_SIZES;

export type IconProps = Omit<SVGProps<SVGSVGElement>, "ref" | "strokeWidth"> & {
  /** Any icon from @hugeicons/core-free-icons, for example Search01Icon. */
  icon: IconSvgElement;
  size?: IconSize;
  /** Required when the icon is the only content of a control. */
  label?: string;
};

/** Beam's single icon component: Hugeicons free set (MIT), fixed sizes and strokes. */
export function Icon({ icon, size = "md", label, className, ...rest }: IconProps) {
  const { size: px, strokeWidth } = ICON_SIZES[size];
  return (
    <HugeiconsIcon
      icon={icon}
      size={px}
      strokeWidth={strokeWidth}
      color="currentColor"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      className={cn("shrink-0", className)}
      {...rest}
    />
  );
}
