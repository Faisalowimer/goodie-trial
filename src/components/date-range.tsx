"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DateRange } from "react-day-picker"
import { CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DatePickerWithRange({
    className,
}: React.HTMLAttributes<HTMLDivElement>) {
    // Default to the last 7 days
    const today = new Date()
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: addDays(today, -7),
        to: today,
    })

    const handlePresetChange = (value: string) => {
        const today = new Date()
        let newRange: DateRange
        if (value === "today") {
            newRange = { from: today, to: today }
        } else if (value === "last7") {
            newRange = { from: addDays(today, -7), to: today }
        } else if (value === "last30") {
            newRange = { from: addDays(today, -30), to: today }
        } else if (value === "ytd") {
            newRange = { from: new Date(today.getFullYear(), 0, 1), to: today }
        } else {
            // If no preset is selected, keep the existing range
            newRange = date || { from: today, to: today }
        }
        setDate(newRange)
    }

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[250px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-1" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto mr-6 mt-2" align="start">
                    {/* Preset Select */}
                    <Select onValueChange={handlePresetChange}>
                        <SelectTrigger className="mb-4">
                            <SelectValue placeholder="Select preset" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="last7">Last 7 Days</SelectItem>
                            <SelectItem value="last30">Last 30 Days</SelectItem>
                            <SelectItem value="ytd">YTD</SelectItem>
                        </SelectContent>
                    </Select>
                    {/* Calendar for custom range selection */}
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
