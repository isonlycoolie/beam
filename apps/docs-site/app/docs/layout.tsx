import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import type { ReactNode } from "react";
import { Announcement } from "@/components/announcement";
import { SidebarStatus, SidebarTop } from "@/components/sidebar-top";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/smooth-scroll";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <Announcement />
      <DocsLayout
        tree={source.getPageTree()}
        nav={{ mode: "top" }}
        tabs={false}
        sidebar={{ banner: SidebarTop, footer: SidebarStatus, collapsible: false }}
        slots={{ header: SiteHeader }}
        containerProps={{ className: "beam-docs" }}
      >
        {children}
      </DocsLayout>
    </>
  );
}
