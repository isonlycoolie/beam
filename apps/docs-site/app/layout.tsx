import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./global.css";

// Geist and Geist Mono by Vercel, SIL Open Font License 1.1: the faces shadcn/ui uses.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: { default: "Beam docs", template: "%s | Beam docs" },
  description: "Design tools for coding agents. Clone, build and verify UI exactly.",
  icons: { icon: "/brand/mark.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} dark`} suppressHydrationWarning>
      {/* The default palette on body, so portalled UI (menus, dialogs, tooltips) gets Beam tokens too. */}
      <body data-theme="default">
        <RootProvider theme={{ defaultTheme: "dark", enableSystem: false }}>{children}</RootProvider>
      </body>
    </html>
  );
}
