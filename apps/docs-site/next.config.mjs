import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ["@beam/ui"],
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
