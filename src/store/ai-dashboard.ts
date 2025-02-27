import { sub } from 'date-fns';
import { create } from 'zustand';
import { logger } from '@/utils/logger';
import { DateRange } from '@/components/dashboard/types';
import { AIAnalytics } from '@/utils/ai-analytics';

export type CompareMode = 'ai-vs-organic' | 'ai-vs-all' | 'ai-breakdown';

interface AIDashboardState {
    data: AIAnalytics | null;
    loading: boolean;
    error: string | null;
    dateRange: DateRange;
    compareMode: CompareMode;
    setData: (data: AIAnalytics | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setDateRange: (dateRange: DateRange) => void;
    setCompareMode: (mode: CompareMode) => void;
    fetchAIAnalytics: () => Promise<void>;
}

export const useAIDashboardStore = create<AIDashboardState>((set, get) => ({
    data: null,
    loading: false,
    error: null,
    dateRange: {
        from: sub(new Date(), { days: 30 }), // Default to last 30 days
        to: new Date(),
    },
    compareMode: 'ai-vs-all' as CompareMode,
    setData: (data) => set({ data }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setDateRange: (dateRange) => {
        set({ dateRange });
        get().fetchAIAnalytics();
    },
    setCompareMode: (mode) => set({ compareMode: mode }),
    fetchAIAnalytics: async () => {
        const { dateRange } = get();
        set({ loading: true, error: null });

        try {
            const params = new URLSearchParams({
                startDate: dateRange.from?.toISOString().split('T')[0] || '',
                endDate: dateRange.to?.toISOString().split('T')[0] || '',
            });

            const response = await fetch(`/api/ai-analytics?${params}`);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to fetch AI analytics');
            }

            if (result.success && result.data) {
                set({ data: result.data });
                logger.info('AI Analytics data fetched successfully', {
                    aiSessions: result.data.aiSessions,
                    totalSessions: result.data.totalSessions
                });
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            logger.error('Failed to fetch AI analytics:', { error: errorMessage });
            set({ error: errorMessage });
        } finally {
            set({ loading: false });
        }
    },
}));

