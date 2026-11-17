import { ArrowDown01Icon, ArrowUp01Icon, LinkSquare02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@beam/ui/components/button";
import { Icon } from "@beam/ui/icons";
import type { ComponentType } from "react";
import { CHOICE_REFS } from "./component-refs-choices";
import { FORM_REFS } from "./component-refs-forms";

/**
 * Components set up exactly like the Stripe instance they were measured from, for scripts/ref-compare.mjs.
 * Rendered alone at /ref/ui-<id>; each id maps to its capture in components/ref-list.json.
 */
export const COMPONENT_REFS: Record<string, { mode: "light" | "dark"; Component: ComponentType }> = {
  ...FORM_REFS,
  ...CHOICE_REFS,
  "ui-button-md": {
    mode: "light",
    Component: () => (
      <Button>
        Start building <Icon icon={ArrowDown01Icon} size="sm" />
      </Button>
    ),
  },
  "ui-button-sm": {
    mode: "light",
    Component: () => (
      <Button variant="outline" size="sm">
        Try it out <Icon icon={LinkSquare02Icon} size="sm" />
      </Button>
    ),
  },
  "ui-button-lg": {
    mode: "light",
    Component: () => (
      <Button variant="secondary" size="lg">
        <span>Hide</span> <Icon icon={ArrowUp01Icon} size="sm" />
      </Button>
    ),
  },
};
