import { DateRange } from "@/components/dashboard/types";
import { differenceInDays } from "date-fns";

type FormatterType = 'number' | 'percentage' | 'duration' | 'currency';

export const formatter = (type: FormatterType) => {
    switch (type) {
        case 'number':
            return formatNumber;
        case 'percentage':
            return formatPercentage;
        case 'duration':
            return formatDuration;
        case 'currency':
            return formatCurrencyWithDecimals;
        default:
            return (value: number) => value.toString();
    }
};

// Formats percentage with comma separators for large values, e.g. "50%" or "10,000%"
export const formatPercentage = (value: number) => {
    return (
        new Intl.NumberFormat("en-US", {
            maximumFractionDigits: 2,
            useGrouping: true,
        }).format(value) + "%"
    );
};

// Formats number with comma separators for large values, e.g. "1,000" or "1,000,000"
export const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 2,
        useGrouping: true,
    }).format(value);
};

// Formats duration (in seconds) to a human readable format, e.g. "10s" or "10m 45s" or "10h 30m 10s"
export function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
}

// Formatted currency string for a given amount ex: $525.25
export const formatCurrencyWithDecimals = (amountInCents: number) => {
    const amountInDollars = amountInCents / 100;
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amountInDollars)
}

export function formatTrendText(trend: number | undefined | string, dateRange: DateRange): string {
    if (trend === undefined) return "Loading...";
    const numericTrend = typeof trend === 'string' ? parseFloat(trend) : trend;
    if (isNaN(numericTrend)) return "Loading...";

    const days = dateRange.from && dateRange.to ? differenceInDays(dateRange.to, dateRange.from) : 7;
    return `${numericTrend >= 0 ? '+' : ''}${numericTrend.toFixed(1)}% in last ${days}d`;
}