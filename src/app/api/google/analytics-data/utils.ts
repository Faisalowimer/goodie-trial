import { AnalyticsSession } from "./types";
import { saveToJsonFile as saveData } from "@/utils/dataSaving";

export async function saveToJsonFile(data: Record<string, AnalyticsSession>): Promise<string> {
    return await saveData(data, {
        baseDir: 'google/analytics-data',
        filePrefix: 'analytics-data',
        customMetadata: {
            dataType: 'analytics-data',
            metrics: [
                'totalUsers',
                'newUsers',
                'sessions',
                'checkouts',
                'bounceRate',
                'addsToCart',
                'engagementRate',
                'engagedSessions',
                'avgSessionDuration'
            ],
            dimensions: [
                'date',
                'city',
                'country',
                'browser',
                'events',
                'searchTerm',
                'sessionSource',
                'sessionMedium'
            ],
            sessionCount: Object.keys(data).length,
            eventTypes: Array.from(
                new Set(
                    Object.values(data)
                        .flatMap(session => session.events)
                )
            ).sort()
        }
    });
}