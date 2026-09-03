import AppLayout from '@/layouts/AppLayout';

import { AccountsTable } from './accounts-table';
import { AnalysisPanel } from './analysis-panel';
import { AttentionQueue } from './attention-queue';
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

export interface QueueItem {
    title: string;
    reason: string;
    age: string;
    severity: 'high' | 'medium' | 'low';
}

export interface Queue {
    status: PanelStatus;
    items: QueueItem[];
}

export interface ChartSeries {
    label: string;
    data: number[];
}

export interface Chart {
    status: PanelStatus;
    question: string;
    labels: string[];
    series: ChartSeries[];
}

export interface AccountRow {
    name: string;
    owner: string;
    stage: string;
    started: string;
    status: string;
}

export interface Accounts {
    status: PanelStatus;
    rows: AccountRow[];
}

interface DemoDashboardProps {
    metrics: Metrics;
    chart: Chart;
    queue: Queue;
    accounts: Accounts;
}

export default function DemoDashboard({ metrics, chart, queue, accounts }: DemoDashboardProps) {
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

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <AnalysisPanel chart={chart} />
                        </div>

                        <AttentionQueue queue={queue} />
                    </div>

                    <AccountsTable accounts={accounts} />
                </div>
            </div>
        </AppLayout>
    );
}
