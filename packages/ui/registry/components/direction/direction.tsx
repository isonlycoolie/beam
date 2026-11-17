/* Based on shadcn/ui (MIT), converted to Beam's measured tokens (radius, shadows, focus, type). */
"use client";

import * as React from "react";
import { Direction } from "radix-ui";

function DirectionProvider({
  dir,
  direction,
  children,
}: React.ComponentProps<typeof Direction.DirectionProvider> & {
  direction?: React.ComponentProps<typeof Direction.DirectionProvider>["dir"];
}) {
  return <Direction.DirectionProvider dir={direction ?? dir}>{children}</Direction.DirectionProvider>;
}

const useDirection = Direction.useDirection;

export { DirectionProvider, useDirection };
