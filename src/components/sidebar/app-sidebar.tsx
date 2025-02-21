"use client"

import * as React from "react"
import { NavUser } from "@/components/sidebar/nav-user"
import { NavMain } from "@/components/sidebar/nav-main"
import { CompanyInfo } from "./company-info"
import { SquareTerminal } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
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
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: SquareTerminal,
      isActive: true,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  const loggedCompany = "Global Vets"
  const loggedCompanyLogo = "/globalVets.png"

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <CompanyInfo company={{
          name: data.company.name,
          logo: data.company.logo,
        }}
        />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                {state === "collapsed" ? (
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild onMouseEnter={() => { }} onMouseLeave={() => { }}>
                        <div className="flex size-12 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                          {loggedCompanyLogo && <Image src={loggedCompanyLogo} alt={loggedCompany} width={64} height={64} />}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        align="center"
                      >
                        {loggedCompany}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <>
                    <div className="flex size-12 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                      {loggedCompanyLogo && <Image src={loggedCompanyLogo} alt={loggedCompany} width={64} height={64} />}
                    </div>
                    <div className="grid flex-1 text-left text-sm">
                      <span className="truncate font-semibold">{loggedCompany}</span>
                    </div>
                  </>
                )}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
