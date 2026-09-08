import { Skeleton } from '@/components/ui/skeleton';

import type { Metrics } from './Dashboard';

const EMPTY_DETAIL = 'No activity recorded for this period yet.';
const ERROR_DETAIL = "Couldn't load this metric.";

// A purely-numeric value ("3") reads fine as "0" when there's no activity yet.
// A value with units ("19 days") does not - "0" there reads as "zero days to
// go live", a false claim rather than an absence. The error branch already
// uses an em dash for exactly this reason; empty gets the same treatment for
// non-numeric metrics.
const NUMERIC_VALUE = /^\d+$/;

export function MetricLedger({ metrics }: { metrics: Metrics }) {
    return (
        <section
            aria-label="Key metrics"
            aria-busy={metrics.status === 'loading'}
            className="bg-card overflow-hidden rounded-lg border"
        >
            {metrics.status === 'loading' && <span className="sr-only">Loading key metrics…</span>}

            <div className="grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
                {metrics.cells.map((cell) => (
                    <div key={cell.label} className="p-4 sm:p-5">
                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                            <span className="bg-primary h-3 w-[3px] rounded-full" aria-hidden="true" />
                            {cell.label}
                        </div>

                        {metrics.status === 'loading' ? (
                            <Skeleton className="mt-2 h-8 w-20" />
                        ) : (
                            <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums lg:text-3xl">
                                {metrics.status === 'empty'
                                    ? NUMERIC_VALUE.test(cell.value)
                                        ? '0'
                                        : '—'
                                    : metrics.status === 'error'
                                      ? '—'
                                      : cell.value}
                            </p>
                        )}

                        <p className="text-muted-foreground mt-1 text-xs">
                            {metrics.status === 'ready' && cell.detail}
                            {metrics.status === 'empty' && EMPTY_DETAIL}
                            {metrics.status === 'error' && ERROR_DETAIL}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
