"use client"

import * as React from "react"
import { NavUser } from "@/components/sidebar/nav-user"
import { NavMain } from "@/components/sidebar/nav-main"
import { NavReports } from "@/components/sidebar/nav-reports"
import { CompanyInfo } from "./company-info"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import { Bot, LifeBuoy, Send, SquareTerminal, TrendingUp, ChartNoAxesCombined, TextSearch } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import Image from "next/image"
const data = {
  company: {
    name: "Goodie AI",
    logo: "/goodie.svg",
  },
  user: {
    firstName: "Faisal",
    lastName: "Owimer",
    email: "faisal@globalvets.co",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Agent Analytics",
      url: "#",
      icon: Bot,
    },
    {
      title: "Trends",
      url: "#",
      icon: ChartNoAxesCombined,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  reports: [
    {
      name: "Keywords",
      url: "#",
      icon: TextSearch,
    },
    {
      name: "Engagement & Conversion",
      url: "#",
      icon: TrendingUp,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const loggedCompany = "Global Vets"
  const loggedCompanyLogo = "/globalVets.png"

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <CompanyInfo company={{
          name: data.company.name,
          //logo: data.company.logo,
        }}
        />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg  text-sidebar-primary-foreground">
                  {loggedCompanyLogo && <Image src={loggedCompanyLogo} alt={loggedCompany} width={32} height={32} />}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{loggedCompany}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavReports reports={data.reports} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
