export type NavGroup = {
  title: string;
  items: NavItem[];
};

export type NavItem = {
  title: string;
  href: string;
  children?: NavItem[];
};

export const navigation: NavGroup[] = [
  {
    title: "Get Started",
    items: [
      { title: "Introduction", href: "/" },
      { title: "Install Beam", href: "/docs/install-beam" },
      { title: "First Inspect", href: "/docs/first-inspect" },
      { title: "Agent Setup", href: "/docs/agent-setup" },
    ],
  },
  {
    title: "Use Beam",
    items: [
      {
        title: "CLI Reference",
        href: "/docs/cli-commands",
        children: [
          { title: "beam login", href: "/docs/beam-login" },
          { title: "beam init", href: "/docs/beam-init" },
          { title: "beam doctor", href: "/docs/beam-doctor" },
          { title: "beam inspect", href: "/docs/beam-inspect" },
          { title: "beam export", href: "/docs/beam-export" },
          { title: "beam compare", href: "/docs/beam-compare" },
          { title: "beam snapshots", href: "/docs/beam-snapshots" },
          { title: "beam mappings", href: "/docs/beam-mappings" },
          { title: "beam debug bundle", href: "/docs/beam-debug-bundle" },
          { title: "beam mcp", href: "/docs/beam-mcp" },
        ],
      },
      { title: "Capabilities", href: "/docs/capabilities" },
    ],
  },
  {
    title: "Architecture",
    items: [
      { title: "System Architecture", href: "/docs/system-architecture" },
      { title: "Contracts", href: "/docs/contracts" },
      { title: "Security", href: "/docs/security" },
      { title: "Rate Limits", href: "/docs/rate-limits" },
    ],
  },
  {
    title: "Business",
    items: [
      { title: "Open Source vs Cloud", href: "/docs/open-source-vs-cloud" },
    ],
  },
];

export const topLinks = [
  { title: "Documentation", href: "/" },
  { title: "Architecture", href: "/docs/system-architecture" },
  { title: "CLI", href: "/docs/cli-commands" },
  { title: "MCP", href: "/docs/agent-setup" },
  { title: "Enterprise", href: "/docs/open-source-vs-cloud" },
];
