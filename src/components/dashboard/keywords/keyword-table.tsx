import { formatter } from "@/utils/format";
import { KeywordAnalytics } from "@/types/analytics";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface KeywordTableProps {
    data?: KeywordAnalytics;
    loading?: boolean;
}

export function KeywordTable({ data, loading = false }: KeywordTableProps) {
    if (loading) {
        return (
            <Card className="dark:bg-accent">
                <CardHeader>
                    <CardTitle>Keyword Performance</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-4">
                    <p className="text-muted-foreground">Loading keyword data...</p>
                </CardContent>
            </Card>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <Card className="dark:bg-accent">
            <CardHeader className="flex flex-col gap-2 items-center justify-between space-y-0 pb-2">
                <CardTitle>Keyword Performance</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Top keywords driving traffic
                </p>
                <Tabs defaultValue="branded" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="branded">Branded</TabsTrigger>
                        <TabsTrigger value="nonBranded">Non-Branded</TabsTrigger>
                    </TabsList>
                    <TabsContent value="branded" className="mt-2">
                        <div className="h-[400px] overflow-auto relative">
                            <Table>
                                <TableHeader className="sticky top-0 bg-background dark:bg-accent z-10">
                                    <TableRow>
                                        <TableHead>Keyword</TableHead>
                                        <TableHead className="text-right">Clicks</TableHead>
                                        <TableHead className="text-right">Impressions</TableHead>
                                        <TableHead className="text-right">CTR</TableHead>
                                        <TableHead className="text-right">Position</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.branded.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{item.keyword}</TableCell>
                                            <TableCell className="text-right">{formatter('number')(item.clicks)}</TableCell>
                                            <TableCell className="text-right">{formatter('number')(item.impressions)}</TableCell>
                                            <TableCell className="text-right">{formatter('percentage')(item.ctr)}</TableCell>
                                            <TableCell className="text-right">{formatter('number')(item.position)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                    <TabsContent value="nonBranded" className="mt-2">
                        <div className="h-[400px] overflow-auto relative">
                            <Table>
                                <TableHeader className="sticky top-0 bg-background dark:bg-accent z-10">
                                    <TableRow>
                                        <TableHead>Keyword</TableHead>
                                        <TableHead className="text-right">Clicks</TableHead>
                                        <TableHead className="text-right">Impressions</TableHead>
                                        <TableHead className="text-right">CTR</TableHead>
                                        <TableHead className="text-right">Position</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.nonBranded.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{item.keyword}</TableCell>
                                            <TableCell className="text-right">{formatter('number')(item.clicks)}</TableCell>
                                            <TableCell className="text-right">{formatter('number')(item.impressions)}</TableCell>
                                            <TableCell className="text-right">{formatter('percentage')(item.ctr)}</TableCell>
                                            <TableCell className="text-right">{formatter('number')(item.position)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardHeader>
        </Card>
    );
} 