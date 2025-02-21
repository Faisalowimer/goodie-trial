"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"
import { useDashboardStore } from "@/store/dashboard"
import { DateRange as DayPickerRange } from "react-day-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DatePickerWithRange({
    className,
}: React.HTMLAttributes<HTMLDivElement>) {
    const { dateRange, setDateRange } = useDashboardStore();
    const [selected, setSelected] = React.useState<DayPickerRange | undefined>({
        from: dateRange.from || undefined,
        to: dateRange.to || undefined,
    });

    const handleSelect = (range: DayPickerRange | undefined) => {
        setSelected(range);
        if (range) {
            setDateRange({ from: range.from || null, to: range.to || null });
        }
    };

    const handlePresetChange = (value: string) => {
        const today = new Date()
        let newRange: DayPickerRange;
        if (value === "today") {
            newRange = { from: today, to: today }
        } else if (value === "last7") {
            newRange = { from: addDays(today, -7), to: today }
        } else if (value === "last30") {
            newRange = { from: addDays(today, -30), to: today }
        } else if (value === "last90") {
            newRange = { from: addDays(today, -90), to: today }
        } else if (value === "ytd") {
            newRange = { from: new Date(today.getFullYear(), 0, 1), to: today }
        } else {
            newRange = { from: dateRange.from || undefined, to: dateRange.to || undefined }
        }
        setSelected(newRange);
        setDateRange({ from: newRange.from || null, to: newRange.to || null });
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
                            !dateRange && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-1" />
                        {dateRange?.from ? (
                            dateRange.to ? (
                                <>
                                    {format(dateRange.from, "LLL dd, y")} -{" "}
                                    {format(dateRange.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(dateRange.from, "LLL dd, y")
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
                            <SelectItem value="last90">Last 90 Days</SelectItem>
                            <SelectItem value="ytd">YTD</SelectItem>
                        </SelectContent>
                    </Select>
                    {/* Calendar for custom range selection */}
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={selected?.from}
                        selected={selected}
                        onSelect={handleSelect}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
