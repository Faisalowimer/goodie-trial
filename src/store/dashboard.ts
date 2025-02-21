import { sub } from 'date-fns';
import { create } from 'zustand';
import { DateRange } from '@/components/dashboard/types';
import { AggregatedMetrics } from '@/types/analytics';

interface DashboardState {
    data: AggregatedMetrics | null;
    loading: boolean;
    dateRange: DateRange;
    setData: (data: AggregatedMetrics | null) => void;
    setLoading: (loading: boolean) => void;
    setDateRange: (dateRange: DateRange) => void;
    fetchDashboardData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
    data: null,
    loading: true,
    dateRange: {
        from: sub(new Date(), { days: 90 }),
        to: new Date(),
    },
    setData: (data) => set({ data }),
    setLoading: (loading) => set({ loading }),
    setDateRange: (dateRange) => {
        set({ dateRange });
        get().fetchDashboardData();
    },
    fetchDashboardData: async () => {
        const { dateRange } = get();
        set({ loading: true });
        try {
            const params = new URLSearchParams({
                from: dateRange.from?.toISOString() || '',
                to: dateRange.to?.toISOString() || '',
            });
            const response = await fetch(`/api/dashboard?${params}`);
            const result = await response.json();
            if (result.success) {
                set({ data: result.data });
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            set({ loading: false });
        }
    },
})); 