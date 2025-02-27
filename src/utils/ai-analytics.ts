import { AnalyticsResponse, AnalyticsSession } from "@/app/api/google/analytics-data/types";

/**
 * Defines the different types of AI sources we track
 */
export type AISourceType =
    | 'CHATGPT'
    | 'PERPLEXITY'
    | 'GOOGLE_AI'
    | 'BING'
    | 'ANTHROPIC'
    | 'YOU'
    | 'PHIND'
    | 'POE'
    | 'OTHER_AI'
    | 'NON_AI';

/**
 * Maps known AI sources to their respective categories
 */
export const AI_SOURCES: Record<AISourceType, string[]> = {
    CHATGPT: ['chatgpt.com', 'ChatGPT-User', 'chat.openai.com'],
    PERPLEXITY: ['perplexity.ai', 'perplexity', 'PerplexityBot'],
    GOOGLE_AI: ['gemini.google.com', 'Google-Extended', 'bard.google.com'],
    BING: ['BingBot', 'bing.com/chat'],
    ANTHROPIC: ['ClaudeBot', 'claude.ai'],
    YOU: ['YouBot', 'you.com'],
    PHIND: ['PhindBot', 'phind.com', 'fahnd.com'],
    POE: ['poe.com'],
    OTHER_AI: ['CCBot', 'AndiBot', 'ExaBot', 'FirecrawlAgent'],
    NON_AI: [] // This is our default category for non-AI sources
};

/**
 * Interface for AI analytics metrics
 */
export interface AIAnalytics {
    totalSessions: number;
    aiSessions: number;
    nonAiSessions: number;
    sourceBreakdown: Record<AISourceType, {
        sessions: number;
        users: number;
        newUsers: number;
        bounceRate: number;
        engagementRate: number;
        avgSessionDuration: number;
    }>;
    conversionMetrics: {
        totalConversions: number;
        aiConversions: number;
        nonAiConversions: number;
        conversionRateBySource: Record<AISourceType, number>;
    };
}

/**
 * Classifies a traffic source into its corresponding AI category
 */
export function classifySource(source: string): AISourceType {
    // Normalize the source for comparison
    const normalizedSource = source.toLowerCase().trim();

    // Check each AI source category
    for (const [sourceType, patterns] of Object.entries(AI_SOURCES)) {
        if (patterns.some(pattern =>
            normalizedSource.includes(pattern.toLowerCase()) ||
            pattern.toLowerCase().includes(normalizedSource)
        )) {
            return sourceType as AISourceType;
        }
    }

    return 'NON_AI';
}

/**
 * Processes analytics data to extract AI-specific insights
 */
export function processAITraffic(analyticsData: AnalyticsResponse): AIAnalytics {
    // Initialize metrics structure
    const metrics: AIAnalytics = {
        totalSessions: 0,
        aiSessions: 0,
        nonAiSessions: 0,
        sourceBreakdown: Object.keys(AI_SOURCES).reduce((acc, source) => {
            acc[source as AISourceType] = {
                sessions: 0,
                users: 0,
                newUsers: 0,
                bounceRate: 0,
                engagementRate: 0,
                avgSessionDuration: 0
            };
            return acc;
        }, {} as AIAnalytics['sourceBreakdown']),
        conversionMetrics: {
            totalConversions: 0,
            aiConversions: 0,
            nonAiConversions: 0,
            conversionRateBySource: Object.keys(AI_SOURCES).reduce((acc, source) => {
                acc[source as AISourceType] = 0;
                return acc;
            }, {} as Record<AISourceType, number>)
        }
    };

    // Process each session
    Object.values(analyticsData).forEach((session: AnalyticsSession) => {
        const sourceType = classifySource(session.sessionSource);
        const isAI = sourceType !== 'NON_AI';

        // Update total sessions
        metrics.totalSessions++;
        if (isAI) {
            metrics.aiSessions++;
        } else {
            metrics.nonAiSessions++;
        }

        // Update source breakdown
        const sourceMetrics = metrics.sourceBreakdown[sourceType];
        sourceMetrics.sessions++;
        sourceMetrics.users += session.metrics.totalUsers;
        sourceMetrics.newUsers += session.metrics.newUsers;
        sourceMetrics.bounceRate =
            (sourceMetrics.bounceRate * (sourceMetrics.sessions - 1) + session.metrics.bounceRate) /
            sourceMetrics.sessions;
        sourceMetrics.engagementRate =
            (sourceMetrics.engagementRate * (sourceMetrics.sessions - 1) + session.metrics.engagementRate) /
            sourceMetrics.sessions;
        sourceMetrics.avgSessionDuration =
            (sourceMetrics.avgSessionDuration * (sourceMetrics.sessions - 1) + session.metrics.avgSessionDuration) /
            sourceMetrics.sessions;

        // Update conversion metrics (assuming checkouts as conversions)
        const conversions = session.metrics.checkouts;
        metrics.conversionMetrics.totalConversions += conversions;
        if (isAI) {
            metrics.conversionMetrics.aiConversions += conversions;
        } else {
            metrics.conversionMetrics.nonAiConversions += conversions;
        }
    });

    // Calculate conversion rates
    Object.keys(metrics.sourceBreakdown).forEach((sourceType) => {
        const source = sourceType as AISourceType;
        const sourceMetrics = metrics.sourceBreakdown[source];
        metrics.conversionMetrics.conversionRateBySource[source] =
            sourceMetrics.sessions > 0 ?
                metrics.conversionMetrics.totalConversions / sourceMetrics.sessions :
                0;
    });

    return metrics;
} 