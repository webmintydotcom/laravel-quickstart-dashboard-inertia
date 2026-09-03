import AppLayout from '@/layouts/AppLayout';

import { MetricLedger } from './metric-ledger';

export type PanelStatus = 'ready' | 'loading' | 'empty' | 'error';

export interface MetricCell {
    label: string;
    value: string;
    detail: string;
}

export interface Metrics {
    status: PanelStatus;
    cells: MetricCell[];
}

interface DemoDashboardProps {
    metrics: Metrics;
}

export default function DemoDashboard({ metrics }: DemoDashboardProps) {
    return (
        <AppLayout title="Onboarding">
            <div className="px-4 py-6 sm:px-6 lg:px-8">
                <div>
                    <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                        Customer onboarding
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight lg:text-3xl">Onboarding pipeline</h1>
                    <p className="text-muted-foreground mt-2 text-sm">
                        Every account currently moving from signed contract to first live use.
                    </p>
                </div>

                <div className="mt-6 space-y-6">
                    <MetricLedger metrics={metrics} />
                </div>
            </div>
        </AppLayout>
    );
}
