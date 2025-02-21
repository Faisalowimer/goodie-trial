import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { DashboardLayoutProps } from "@/components/dashboard/types";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
    title: "Dashboard | Goodie AI",
};

export default function DashboardLayout({ children, defaultOpen, fontClasses }: DashboardLayoutProps) {
    return (
        <div className={fontClasses}>
            <SidebarProvider defaultOpen={defaultOpen}>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="#">
                                            Dashboard
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <DashboardTabs />
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}