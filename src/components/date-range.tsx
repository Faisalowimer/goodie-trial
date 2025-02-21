"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { useDashboardStore } from "@/store/dashboard"
import { format, sub, startOfYear } from "date-fns"
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

    const handlePresetChange = (preset: string) => {
        const today = new Date();
        let newRange: DayPickerRange = { from: today, to: today };

        switch (preset) {
            case "today":
                newRange = { from: today, to: today };
                break;
            case "last7":
                newRange = { from: sub(today, { days: 7 }), to: today };
                break;
            case "last30":
                newRange = { from: sub(today, { days: 30 }), to: today };
                break;
            case "last90":
                newRange = { from: sub(today, { days: 90 }), to: today };
                break;
            case "ytd":
                newRange = { from: startOfYear(today), to: today };
                break;
            case "allTime":
                newRange = { from: new Date(2020, 0, 1), to: today };
                break;
            default:
                break;
        }

        setSelected(newRange);
        useDashboardStore.getState().setDateRange({
            from: newRange.from || null,
            to: newRange.to || null
        });
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
                        <SelectTrigger className="mb-2">
                            <SelectValue placeholder="Select preset" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="last7">Last 7 days</SelectItem>
                            <SelectItem value="last30">Last 30 days</SelectItem>
                            <SelectItem value="last90">Last 90 days</SelectItem>
                            <SelectItem value="ytd">Year to date</SelectItem>
                            <SelectItem value="allTime">All Time</SelectItem>
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
