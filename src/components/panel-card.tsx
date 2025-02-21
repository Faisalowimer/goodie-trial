import { Skeleton } from "@/components/ui/skeleton";
import { formatter } from "@/utils/format";
import { Card, CardContent } from "@/components/ui/card";

interface PanelCardProps {
    title: string;
    value: number;
    statsMsg: string;
    format?: "number" | "percentage" | "duration" | undefined;
    isLoading?: boolean;
}

export function PanelCard({
    title,
    value,
    statsMsg,
    format,
    isLoading = false
}: PanelCardProps) {
    return (
        <Card className="bg-accent w-full">
            <CardContent className="flex flex-col justify-between p-6">
                <div className="space-y-2">
                    <p className="text-base font-semibold text-muted-foreground">
                        {title}
                    </p>
                    <div className="mt-2 space-y-1">
                        {isLoading ? (
                            <Skeleton className="h-9 w-[120px]" />
                        ) : (
                            <div className="space-y-1">
                                <p className="text-4xl font-bold tracking-tight text-foreground">
                                    {formatter(format)(value)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {statsMsg}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}