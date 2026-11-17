import { Tag01Icon } from "@hugeicons/core-free-icons";
import { Badge } from "@beam/ui/components/badge";
import { Checkbox } from "@beam/ui/components/checkbox";
import { Input } from "@beam/ui/components/input";
import { Label } from "@beam/ui/components/label";
import { RadioCard, RadioGroup } from "@beam/ui/components/radio-group";
import { Icon } from "@beam/ui/icons";
import type { ComponentType } from "react";

/** Chips, choices and fields set up like their Stripe Checkout captures (Pictures/beam/references/stripe/ui). */
export const CHOICE_REFS: Record<string, { mode: "light" | "dark"; Component: ComponentType }> = {
  "ui-chip": {
    mode: "light",
    Component: () => (
      <Badge>
        <span>No code</span>
        <span aria-hidden className="h-3 w-0.5 bg-border" />
        <span>Low code</span>
      </Badge>
    ),
  },
  "ui-tag": {
    mode: "light",
    Component: () => (
      <Badge variant="secondary" size="lg">
        <Icon icon={Tag01Icon} size="sm" className="text-text-2" />
        <span>SAVE10</span>
      </Badge>
    ),
  },
  "ui-radio-cards": {
    mode: "light",
    Component: () => (
      <RadioGroup defaultValue="tzs" aria-label="Currency" className="w-[380px] grid-cols-2">
        <RadioCard value="tzs">
          <span aria-hidden className="h-4 w-[22px] rounded-[2px] bg-chart-3" />
          <span>TZS 78,800.08</span>
        </RadioCard>
        <RadioCard value="usd">
          <span aria-hidden className="h-4 w-[22px] rounded-[2px] bg-chart-4" />
          <span>US$28.80</span>
        </RadioCard>
      </RadioGroup>
    ),
  },
  "ui-checkbox": {
    mode: "light",
    Component: () => (
      <div className="flex w-[203px] items-start gap-3">
        <Checkbox defaultChecked className="mt-1" aria-label="Billing info is same as shipping" />
        <Label className="h-[21px] whitespace-nowrap text-[13px] leading-[16.9px] font-normal text-text-1">
          <span>Billing info is same as shipping</span>
        </Label>
      </div>
    ),
  },
  "ui-field": {
    mode: "light",
    Component: () => (
      <div className="flex w-[378px] flex-col gap-1">
        <Label htmlFor="email" className="h-[21px]">
          <span>Email</span>
        </Label>
        <Input id="email" size="lg" placeholder="email@example.com" />
      </div>
    ),
  },
};
