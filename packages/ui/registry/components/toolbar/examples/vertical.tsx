"use client";

import { useState } from "react";
import { Add01Icon, CenterFocusIcon, MinusSignIcon } from "@hugeicons/core-free-icons";
import { Toolbar, ToolbarButton, ToolbarOutput, ToolbarSeparator } from "@beam/ui/components/toolbar";
import { Icon } from "@beam/ui/icons";

export default function ToolbarVertical() {
  const [zoom, setZoom] = useState(100);
  return (
    <Toolbar aria-label="Canvas zoom" orientation="vertical">
      <ToolbarButton size="icon" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(400, z + 10))}>
        <Icon icon={Add01Icon} size="sm" />
      </ToolbarButton>
      <ToolbarOutput>{zoom}%</ToolbarOutput>
      <ToolbarButton size="icon" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(10, z - 10))}>
        <Icon icon={MinusSignIcon} size="sm" />
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton size="icon" aria-label="Fit to screen" onClick={() => setZoom(100)}>
        <Icon icon={CenterFocusIcon} size="sm" />
      </ToolbarButton>
    </Toolbar>
  );
}
