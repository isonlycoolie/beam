import type { ReactNode } from "react";

/**
 * Re-mounts the page on every navigation (a layout would keep it), so the page's entrance animation
 * (#nd-page in app/global.css) plays each time while the header and sidebar, in the layout, stay still.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
