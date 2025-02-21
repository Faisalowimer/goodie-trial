export const formatter = (
    format: "number" | "percentage" | "duration" | undefined
): ((value: number) => string) => {
    if (format === "number") return formatNumber;
    if (format === "percentage") return formatPercentage;
    if (format === "duration") return formatDuration;
    // Fallback: simply convert the number to a string.
    return (value: number) => value.toString();
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
export const formatDuration = (value: number) => {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = value % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    }
    if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
};
