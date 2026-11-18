"use client";

import { Button } from "@beam/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@beam/ui/components/dialog";
import { PortalContainer } from "@beam/ui/components/portal-container";
import { useState } from "react";

/** A dialog that opens inside the panel, not over the page. */
export default function PortalContainerDefault() {
  const [panel, setPanel] = useState<HTMLDivElement | null>(null);
  return (
    <div ref={setPanel} className="relative flex h-[280px] w-full max-w-[440px] items-center justify-center overflow-hidden rounded-(--radius-card) border border-border [transform:translateZ(0)]">
      <PortalContainer container={panel}>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open in this panel</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Inside the panel</DialogTitle>
              <DialogDescription>The overlay covers only this panel.</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </PortalContainer>
    </div>
  );
}
