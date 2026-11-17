"use client";

import { toast } from "sonner";
import { Button } from "@beam/ui/components/button";
import { Toaster } from "@beam/ui/components/sonner";

export default function SonnerDefault() {
  return (
    <>
      <Toaster />
      <Button variant="outline" onClick={() => toast("Refund sent", { description: "TZS 8,755.56 to Jenny Rosen" })}>
        Refund payment
      </Button>
    </>
  );
}
