import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "./global.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-text" });
const sora = Sora({ subsets: ["latin"], variable: "--font-display" });
// Mona Sans Mono by GitHub, SIL Open Font License 1.1.
const mono = localFont({ src: "../public/fonts/MonaSansMonoVF.woff2", variable: "--font-code", weight: "200 900" });

export const metadata: Metadata = {
  title: { default: "Beam docs", template: "%s | Beam docs" },
  description: "Design tools for coding agents. Clone, build and verify UI exactly.",
  icons: { icon: "/brand/mark.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} ${mono.variable} dark`} suppressHydrationWarning>
      <body>
        <RootProvider theme={{ defaultTheme: "dark", enableSystem: false }}>{children}</RootProvider>
      </body>
    </html>
  );
}
