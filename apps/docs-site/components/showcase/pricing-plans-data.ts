// Plan content for the pricing plans showcase (pricing-plans.tsx).
export type Tier = {
  name: string;
  featured?: boolean;
  price: string;
  note?: string;
  spend?: [amount: string, load: string];
  action: string;
  postgres: Array<[text: string, info?: boolean]>;
  backend: Array<[text: string, info?: boolean]>;
};

const BACKEND: Tier["backend"] = [["Managed Better Auth", true], ["Object Storage", true], ["Functions", true], ["AI Gateway", true], ["Realtime (Beta)", true]];

export const TIERS: Tier[] = [
  {
    name: "Free",
    price: "$0",
    note: "Build and learn free with no time limits and no credit card required.",
    action: "Try it free",
    postgres: [["100 projects", true], ["100 CU-hrs monthly per project", true], ["1 GB of storage per project"], ["Sizes up to 2 CU (8 GB RAM)"], ["Unlimited team members"]],
    backend: [["Managed Better Auth", true], ["5 GB of Object Storage", true], ["Functions", true], ["AI Gateway", true], ["Realtime (Beta)", true]],
  },
  {
    name: "Launch",
    featured: true,
    price: "Usage-based",
    spend: ["$15", "Intermittent load, 1 GB"],
    action: "Get started",
    postgres: [["100 projects", true], ["$0.106 per CU-hr", true], ["$0.35 per GB-month"], ["Sizes up to 16 CU (64 GB RAM)"], ["3-day metrics/logs in UI"]],
    backend: BACKEND,
  },
  {
    name: "Scale",
    price: "Usage-based",
    spend: ["$701", "High load, 100 GB"],
    action: "Get started",
    postgres: [["1,000+ projects", true], ["$0.222 per CU-hr", true], ["$0.35 per GB-month"], ["Sizes up to 56 CU (224 GB RAM)"], ["SLAs, HIPAA, private network"]],
    backend: BACKEND,
  },
];
