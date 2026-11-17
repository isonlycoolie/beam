import type { ComponentType } from "react";
import { NeonPricing } from "./neon-pricing";
import { StripeAccounts } from "./stripe-accounts";
import { StripeBilling } from "./stripe-billing";

/** Every rebuilt reference: what it is, where it came from, and the mode the reference was captured in. */
export const SHOWCASES: Record<string, { title: string; reference: string; url: string; mode: "light" | "dark"; Component: ComponentType }> = {
  "stripe-accounts": { title: "Connected accounts", reference: "Stripe", url: "https://stripe.com", mode: "light", Component: StripeAccounts },
  "stripe-billing": { title: "Usage billing", reference: "Stripe", url: "https://stripe.com", mode: "light", Component: StripeBilling },
  "neon-pricing": { title: "Plans", reference: "Neon", url: "https://neon.com/pricing", mode: "dark", Component: NeonPricing },
};
