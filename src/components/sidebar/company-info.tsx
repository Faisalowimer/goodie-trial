"use client"

import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/ui/theme/mode-toggle"
import { SidebarMenu, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface CompanyInfoProps {
    company: {
        name: string
        logo?: React.ElementType
    }
}

export function CompanyInfo({ company }: CompanyInfoProps) {
    const { state } = useSidebar()

    const logo = (
        <div className="flex aspect-square size-9 items-center justify-center rounded-lg text-sidebar-primary-foreground">
            {company.logo && <company.logo />}
        </div>
    )

    return (
        <SidebarMenu className="mt-2">
            <SidebarMenuItem>
                <div
                    className={cn(
                        "flex items-center px-1 min-h-[var(--sidebar-button-height)]",
                        state === "collapsed" && "min-h-[5rem] flex-col items-center"
                    )}
                >
                    {state === "collapsed" ? (
                        <div className="flex flex-col items-center gap-2">
                            <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                    <TooltipTrigger asChild onMouseEnter={() => { }} onMouseLeave={() => { }}>
                                        {logo}
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="right"
                                        align="center"
                                    //sideOffset={18}
                                    >
                                        {company.name}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <ModeToggle />
                        </div>
                    ) : (
                        <>
                            {logo}
                            <div className="grid flex-1 text-left text-sm leading-tight ml-1">
                                <span className="truncate font-semibold">
                                    {company.name}
                                </span>
                            </div>
                            <ModeToggle />
                        </>
                    )}
                </div>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}