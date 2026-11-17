import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, Sora } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "./global.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
// Display face of the Studio theme.
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage" });
// Mona Sans Mono by GitHub, SIL Open Font License 1.1.
const mono = localFont({ src: "../public/fonts/MonaSansMonoVF.woff2", variable: "--font-mona-mono", weight: "200 900" });

export const metadata: Metadata = {
  title: { default: "Beam docs", template: "%s | Beam docs" },
  description: "Design tools for coding agents. Clone, build and verify UI exactly.",
  icons: { icon: "/brand/mark.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} ${bricolage.variable} ${mono.variable} dark`} suppressHydrationWarning>
      <body>
        <RootProvider theme={{ defaultTheme: "dark", enableSystem: false }}>{children}</RootProvider>
      </body>
    </html>
  );
}
