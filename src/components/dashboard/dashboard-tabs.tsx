"use client"

// import { usePathname } from 'next/navigation'
import { DatePickerWithRange } from "@/components/date-range"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import Link from 'next/link'

export function DashboardTabs() {
    // const pathname = usePathname()

    // const defaultTab = pathname?.includes('agent-analytics')
    //     ? 'agent-analytics'
    //     : pathname?.includes('trends')
    //         ? 'trends'
    //         : 'dashboard'

    return (
        <div className="flex flex-col md:flex-row items-start justify-between gap-4 pb-3 px-4 w-full">
            <div className="w-full md:w-auto">
                {/* <Tabs value={defaultTab} className="w-full md:w-auto">
                    <TabsList className="border-b">
                        <TabsTrigger value="dashboard" asChild>
                            <Link href={`/dashboard`}>
                                Dashboard
                            </Link>
                        </TabsTrigger>
                        <TabsTrigger value="agent-analytics" asChild>
                            <Link href={`/agent-analytics`}>
                                Agent Analytics
                            </Link>
                        </TabsTrigger>
                        <TabsTrigger value="trends" asChild>
                            <Link href={`/trends`}>
                                Trends
                            </Link>
                        </TabsTrigger>
                    </TabsList>
                </Tabs> */}
            </div>


            <div className="w-full md:w-auto">
                <DatePickerWithRange />
            </div>
        </div>
    )
} 