"use client";

/*
 * Where overlays (Dialog, Alert Dialog, Sheet, Drawer) render. By default they cover the page; inside a
 * PortalContainer they open in that element instead, centred in it and clipped to it: a preview, a panel, a
 * device frame. Give the element `transform` or `contain: layout` so their fixed positioning is relative to it.
 */
import { createContext, type ReactNode, useContext } from "react";

const PortalContainerContext = createContext<HTMLElement | null>(null);

/** Overlays opened inside `children` render into `container`. */
function PortalContainer({ container, children }: { container: HTMLElement | null; children: ReactNode }) {
  return <PortalContainerContext.Provider value={container}>{children}</PortalContainerContext.Provider>;
}

/** The container overlays should render into, or undefined for the page. */
function usePortalContainer(): HTMLElement | undefined {
  return useContext(PortalContainerContext) ?? undefined;
}

export { PortalContainer, usePortalContainer };
