import { Info } from "lucide-react";
import type { ReactNode } from "react";

export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="callout">
      <Info size={18} />
      <div>{children}</div>
    </div>
  );
}
