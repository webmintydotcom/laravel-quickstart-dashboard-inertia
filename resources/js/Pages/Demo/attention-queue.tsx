import { AlertCircle, AlertTriangle, Info, type LucideIcon } from 'lucide-react';

import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import type { Queue, QueueItem } from './Dashboard';
import { PanelEmpty, PanelError } from './panel-state';

const SEVERITY: Record<QueueItem['severity'], { label: string; icon: LucideIcon; variant: BadgeVariant }> = {
    high: { label: 'High', icon: AlertTriangle, variant: 'destructive' },
    medium: { label: 'Medium', icon: AlertCircle, variant: 'warning' },
    low: { label: 'Low', icon: Info, variant: 'outline' },
};

const ERROR_DETAIL = "Couldn't load the attention queue.";

export function AttentionQueue({ queue }: { queue: Queue }) {
    return (
        <Card asChild className="gap-0 overflow-hidden rounded-lg py-0">
            <section aria-labelledby="attention-queue-heading" aria-busy={queue.status === 'loading'}>
                <CardHeader className="min-h-11 items-center gap-x-4 gap-y-0 border-b px-4 py-4 sm:px-5">
                    <CardTitle asChild className="text-base">
                        <h2 id="attention-queue-heading">Needs a decision</h2>
                    </CardTitle>
                    <CardAction className="row-span-1 self-center">
                        {/* type={undefined} stops Button's default type="button" landing on the anchor. */}
                        <Button asChild variant="link" type={undefined} className="min-h-11 px-0 font-semibold">
                            <a href="#accounts-table">View all</a>
                        </Button>
                    </CardAction>
                </CardHeader>

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
                                    <Badge variant={severity.variant} className="shrink-0 font-semibold">
                                        <SeverityIcon aria-hidden="true" />
                                        <span className="sr-only">Severity:</span>
                                        {severity.label}
                                    </Badge>

                                    <span className="min-w-0 flex-1">
                                        <span className="text-foreground block text-sm font-semibold">
                                            {item.title}
                                        </span>
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
        </Card>
    );
}
