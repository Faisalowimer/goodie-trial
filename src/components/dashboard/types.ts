export interface DashboardLayoutProps {
    children: React.ReactNode;
    fontClasses: string;
    defaultOpen: boolean;
}

export type DateRange = {
    from: Date | null | undefined
    to: Date | null | undefined
}