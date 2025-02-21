import { formatter } from "@/utils/format";
import { KeywordAnalytics } from "@/types/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
                <CardContent className="h-[400px] flex items-center justify-center py-4">
                    <p className="text-muted-foreground">Loading keyword data...</p>
                </CardContent>
            </Card>
        );
    }

    if (!data || (!data.branded.length && !data.nonBranded.length)) {
        return (
            <Card className="dark:bg-accent">
                <CardHeader>
                    <CardTitle>Keyword Performance</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center py-4">
                    <p className="text-muted-foreground">No keyword data available</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="dark:bg-accent">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Keyword Performance</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Top keywords driving traffic
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="branded" className="w-full">
                    <div className="flex items-center justify-between mb-4">
                        <TabsList className="bg-background dark:bg-background">
                            <TabsTrigger value="branded" className="data-[state=active]:bg-accent">Branded</TabsTrigger>
                            <TabsTrigger value="nonBranded" className="data-[state=active]:bg-accent">Non-Branded</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="branded" className="mt-0">
                        <div className="h-[400px] overflow-auto relative">
                            <Table>
                                <TableHeader className="sticky top-0 bg-background dark:bg-accent z-10">
                                    <TableRow className="border-b dark:border-black">
                                        <TableHead>Keyword</TableHead>
                                        <TableHead className="text-right">Clicks</TableHead>
                                        <TableHead className="text-right">Impressions</TableHead>
                                        <TableHead className="text-right">CTR</TableHead>
                                        <TableHead className="text-right">Position</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.branded.map((item, index) => (
                                        <TableRow key={index} className="border-b dark:border-black">
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
                                    <TableRow className="border-b dark:border-black">
                                        <TableHead>Keyword</TableHead>
                                        <TableHead className="text-right">Clicks</TableHead>
                                        <TableHead className="text-right">Impressions</TableHead>
                                        <TableHead className="text-right">CTR</TableHead>
                                        <TableHead className="text-right">Position</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.nonBranded.map((item, index) => (
                                        <TableRow key={index} className="border-b dark:border-black">
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
            </CardContent>
        </Card>
    );
} 