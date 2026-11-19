"use client";

import { Add01Icon } from "@hugeicons/core-free-icons";
import * as React from "react";
import { Composer, ComposerAction, ComposerFooter, ComposerInput, ComposerSubmit } from "@beam/ui/components/composer";
import { Icon } from "@beam/ui/icons";

// Send a message and the reply "runs": Send turns into Stop until it ends or is stopped.
export default function ComposerRunning() {
  const [status, setStatus] = React.useState<"idle" | "running">("running");
  return (
    <Composer className="w-[520px]" status={status} onSubmit={() => setStatus("running")} onStop={() => setStatus("idle")}>
      <ComposerInput placeholder="Ask a follow-up" />
      <ComposerFooter>
        <ComposerAction aria-label="Add files">
          <Icon icon={Add01Icon} size="sm" />
        </ComposerAction>
        <ComposerSubmit className="ms-auto" />
      </ComposerFooter>
    </Composer>
  );
}
