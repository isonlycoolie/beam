"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { LeftSidebar } from "./left-sidebar";

type MobileNavProps = {
  activeSlug: string;
};

export function MobileNav({ activeSlug }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("navLocked", open);
    return () => document.body.classList.remove("navLocked");
  }, [open]);

  return (
    <>
      <button
        aria-expanded={open}
        aria-label="Open documentation menu"
        className="mobileNavButton"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Menu size={18} />
      </button>
      {open ? (
        <div className="mobileNavLayer">
          <button
            aria-label="Close documentation menu"
            className="mobileNavBackdrop"
            onClick={() => setOpen(false)}
            type="button"
          />
          <aside aria-label="Documentation menu" className="mobileNavDrawer">
            <div className="mobileNavHeader">
              <div>
                <span>Beam</span>
                <strong>Documentation</strong>
              </div>
              <button
                aria-label="Close documentation menu"
                className="mobileNavClose"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>
            <div onClick={() => setOpen(false)}>
              <LeftSidebar activeSlug={activeSlug} variant="mobile" />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
