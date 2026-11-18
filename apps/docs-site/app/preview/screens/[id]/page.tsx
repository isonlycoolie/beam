import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allScreens } from "@/lib/screens";
import { ScreenRoot } from "./screen-root";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { robots: { index: false } };
export const generateStaticParams = () => allScreens().map((s) => ({ id: s.id }));

/** One screen, full page, on its own: the docs show it in a frame so its layout, sheets and menus behave as in an app. */
export default async function Page({ params }: Props) {
  const { id } = await params;
  if (!allScreens().some((s) => s.id === id)) notFound();
  return <ScreenRoot id={id} />;
}
