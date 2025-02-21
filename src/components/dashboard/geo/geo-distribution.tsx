import { formatter } from "@/utils/format";
import { GeoDistributionProps } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function GeoDistribution({ data, loading = false }: GeoDistributionProps) {
    if (loading) {
        return (
            <Card className="dark:bg-accent">
                <CardHeader>
                    <CardTitle>Geographic Distribution</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-4">
                    <p className="text-muted-foreground">Loading geographic data...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="dark:bg-accent">
            <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Search visibility and performance by country (lower position indicates better visibility)
                </p>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] overflow-auto relative">
                    <Table>
                        <TableHeader className="sticky top-0 bg-background dark:bg-accent z-10">
                            <TableRow>
                                <TableHead>Country</TableHead>
                                <TableHead className="text-right">Clicks</TableHead>
                                <TableHead className="text-right">Impressions</TableHead>
                                <TableHead className="text-right">CTR</TableHead>
                                <TableHead className="text-right">Position</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{item.country}</TableCell>
                                    <TableCell className="text-right">{formatter('number')(item.clicks)}</TableCell>
                                    <TableCell className="text-right">{formatter('number')(item.impressions)}</TableCell>
                                    <TableCell className="text-right">{formatter('percentage')(item.ctr)}</TableCell>
                                    <TableCell className="text-right">{formatter('number')(item.position)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
} 