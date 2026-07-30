import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beam Documentation",
  description: "Local-first Figma design context bridge for coding agents.",
  icons: {
    apple: "/beam.png",
    icon: "/beam.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
