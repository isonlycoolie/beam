import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ["@beam/ui"],
  // NEXT_BUILD_CPUS=3 builds with fewer page workers, for machines short on memory.
  ...(process.env.NEXT_BUILD_CPUS ? { experimental: { cpus: Number(process.env.NEXT_BUILD_CPUS) } } : {}),
  // Beam UI was one section; it is now Components, Palettes and Icons.
  async redirects() {
    return [
      { source: "/docs/ui", destination: "/docs/components", permanent: true },
      { source: "/docs/ui/palettes", destination: "/docs/palettes", permanent: true },
      { source: "/docs/ui/icons", destination: "/docs/icons/browse", permanent: true },
      { source: "/docs/ui/:path*", destination: "/docs/components/:path*", permanent: true },
    ];
  },
};

export default withMDX(config);
