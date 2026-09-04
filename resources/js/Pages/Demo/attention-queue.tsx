import { AlertCircle, AlertTriangle, Info, type LucideIcon } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import type { Queue, QueueItem } from './Dashboard';
import { PanelEmpty, PanelError } from './panel-state';

const SEVERITY: Record<QueueItem['severity'], { label: string; icon: LucideIcon; className: string }> = {
    high: { label: 'High', icon: AlertTriangle, className: 'text-destructive' },
    // Borrows a data-visualisation token for a semantic (severity) purpose, so
    // re-palettizing the chart series would change this too. There is no
    // `warning` token in resources/css/app.css yet - if one is added, this
    // should move to it instead of a chart token.
    medium: { label: 'Medium', icon: AlertCircle, className: 'text-chart-3' },
    low: { label: 'Low', icon: Info, className: 'text-muted-foreground' },
};

const ERROR_DETAIL = "Couldn't load the attention queue.";

export function AttentionQueue({ queue }: { queue: Queue }) {
    return (
        <section
            aria-labelledby="attention-queue-heading"
            aria-busy={queue.status === 'loading'}
            className="bg-card overflow-hidden rounded-lg border"
        >
            <div className="flex min-h-11 items-center justify-between gap-4 border-b px-4 py-4 sm:px-5">
                <h2 id="attention-queue-heading" className="text-base font-semibold">
                    Needs a decision
                </h2>
                <a
                    href="#accounts-table"
                    className="text-primary hover:text-primary/80 inline-flex min-h-11 items-center text-sm font-semibold"
                >
                    View all
                </a>
            </div>

            {queue.status === 'loading' && (
                <div className="divide-y">
                    <span className="sr-only">Loading the attention queue…</span>
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="flex items-start gap-3 px-4 py-4 sm:px-5">
                            <Skeleton className="mt-0.5 h-4 w-4 shrink-0 rounded-full" />
                            <div className="min-w-0 flex-1 space-y-2">
                                <Skeleton className="h-4 w-2/5" />
                                <Skeleton className="h-3 w-3/5" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {queue.status === 'empty' && (
                <PanelEmpty
                    title="Bring in your first account"
                    detail="Accounts that stall, lose an owner, or run late will surface here."
                    className="py-10"
                />
            )}

            {queue.status === 'error' && <PanelError detail={ERROR_DETAIL} className="py-10" />}

            {queue.status === 'ready' && (
                <ul className="divide-y">
                    {queue.items.map((item) => {
                        const severity = SEVERITY[item.severity];
                        const SeverityIcon = severity.icon;

                        return (
                            <li key={item.title} className="flex items-start gap-3 px-4 py-4 sm:px-5">
                                <span
                                    className={cn(
                                        'mt-0.5 inline-flex shrink-0 items-center gap-1 text-xs font-semibold',
                                        severity.className,
                                    )}
                                >
                                    <SeverityIcon className="h-4 w-4" aria-hidden="true" />
                                    <span className="sr-only">Severity:</span>
                                    {severity.label}
                                </span>

                                <span className="min-w-0 flex-1">
                                    <span className="text-foreground block text-sm font-semibold">{item.title}</span>
                                    <span className="text-muted-foreground mt-1 block text-sm">
                                        {item.reason} · {item.age}
                                    </span>
                                </span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}
