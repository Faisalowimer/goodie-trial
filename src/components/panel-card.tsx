import { Card, CardContent } from "@/components/ui/card";
import { formatter } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";

export interface PanelCardProps {
    title: string;
    value: number;
    trend: string;
    format: "number" | "percentage" | "duration";
    formatFn?: (value: number) => string;
    isLoading?: boolean;
}

export function PanelCard({ title, value, trend, format, formatFn, isLoading = false }: PanelCardProps) {
    const formattedValue = formatFn ? formatFn(value) : formatter(format)(value);

    return (
        <Card className="dark:bg-accent">
            <CardContent className="pt-6">
                {isLoading ? (
                    <>
                        <Skeleton className="h-8 w-24 mb-2" />
                        <Skeleton className="h-4 w-32 mb-3" />
                        <Skeleton className="h-5 w-28" />
                    </>
                ) : (
                    <>
                        <p className="text-base font-semibold leading-none mb-2">{title}</p>
                        <div className="text-4xl font-bold">{formattedValue}</div>
                        <p className="text-xs text-muted-foreground">{trend}</p>
                    </>
                )}
            </CardContent>
        </Card>
    );
}