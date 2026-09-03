import { AlertCircle, AlertTriangle, Info, type LucideIcon } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import type { Queue, QueueItem } from './Dashboard';

const SEVERITY: Record<QueueItem['severity'], { label: string; icon: LucideIcon; className: string }> = {
    high: { label: 'High', icon: AlertTriangle, className: 'text-destructive' },
    medium: { label: 'Medium', icon: AlertCircle, className: 'text-chart-3' },
    low: { label: 'Low', icon: Info, className: 'text-muted-foreground' },
};

const ERROR_DETAIL = "Couldn't load the attention queue.";

export function AttentionQueue({ queue }: { queue: Queue }) {
    return (
        <section aria-labelledby="attention-queue-heading" className="bg-card overflow-hidden rounded-lg border">
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
                <div className="px-4 py-10 text-center sm:px-5">
                    <p className="text-sm font-semibold">Bring in your first account</p>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Accounts that stall, lose an owner, or run late will surface here.
                    </p>
                </div>
            )}

            {queue.status === 'error' && (
                <div className="px-4 py-10 text-center sm:px-5">
                    <p className="text-sm font-semibold">{ERROR_DETAIL}</p>
                    <p className="text-muted-foreground mt-1 text-sm">Reload the page to try again.</p>
                </div>
            )}

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
