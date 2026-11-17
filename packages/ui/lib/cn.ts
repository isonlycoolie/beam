import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge has to know Beam's type steps are font sizes. Otherwise it reads `text-body` as a text colour
 * and drops `text-primary-foreground`, leaving labels invisible on filled buttons.
 */
const merge = extendTailwindMerge<"beam-numeric">({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display", "h1", "h2", "h3", "body", "small", "caption"] }],
      "beam-numeric": ["text-numeric"],
    },
  },
});

/** Joins class names and lets later Tailwind classes win over earlier ones (shadcn's helper). */
export function cn(...inputs: ClassValue[]): string {
  return merge(clsx(inputs));
}
