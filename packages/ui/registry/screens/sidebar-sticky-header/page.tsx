/* Based on shadcn/ui (MIT), converted to Beam components and tokens. */
import { AppSidebar } from "./components/app-sidebar";
import { SiteHeader } from "./components/site-header";
import { SidebarInset, SidebarProvider } from "@beam/ui/components/sidebar";

export const iframeHeight = "800px";

export const description = "A sidebar with a header and a search form.";

export default function Page() {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-(--radius-xl) bg-surface-2/50" />
                <div className="aspect-video rounded-(--radius-xl) bg-surface-2/50" />
                <div className="aspect-video rounded-(--radius-xl) bg-surface-2/50" />
              </div>
              <div className="min-h-[100vh] flex-1 rounded-(--radius-xl) bg-surface-2/50 md:min-h-min" />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
