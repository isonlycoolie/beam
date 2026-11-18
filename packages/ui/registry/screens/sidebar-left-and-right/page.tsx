/* Based on shadcn/ui (MIT), converted to Beam components and tokens. */
import { SidebarLeft } from "./components/sidebar-left";
import { SidebarRight } from "./components/sidebar-right";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@beam/ui/components/breadcrumb";
import { Separator } from "@beam/ui/components/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@beam/ui/components/sidebar";

export default function Page() {
  return (
    <SidebarProvider>
      <SidebarLeft />
      <SidebarInset>
        <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">Project Management & Task Tracking</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="mx-auto h-24 w-full max-w-3xl rounded-(--radius-xl) bg-surface-2/50" />
          <div className="mx-auto h-[100vh] w-full max-w-3xl rounded-(--radius-xl) bg-surface-2/50" />
        </div>
      </SidebarInset>
      <SidebarRight />
    </SidebarProvider>
  );
}
