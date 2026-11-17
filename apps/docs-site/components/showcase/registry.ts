import type { ComponentType } from "react";
import { AccountsTable } from "./accounts-table";
import { PricingPlans } from "./pricing-plans";
import { UsageBilling } from "./usage-billing";

/** Every rebuilt showcase: its title and the mode it was measured in. Sources are credited once, in CREDITS.md. */
export const SHOWCASES: Record<string, { title: string; mode: "light" | "dark"; Component: ComponentType }> = {
  "accounts-table": { title: "Connected accounts", mode: "light", Component: AccountsTable },
  "usage-billing": { title: "Usage billing", mode: "light", Component: UsageBilling },
  "pricing-plans": { title: "Plans", mode: "dark", Component: PricingPlans },
};
