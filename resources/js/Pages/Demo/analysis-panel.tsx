import { router } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { Chart } from './chart';
import type { Chart as ChartData } from './Dashboard';

const ERROR_DETAIL = "Couldn't load this chart.";

// Fixed height so the canvas has somewhere to size itself: `maintainAspectRatio:
// false` means Chart.js will not derive a height from its own aspect ratio.
const CHART_HEIGHT = 'h-64';

// Written as literal class names (not built with template interpolation) so
// Tailwind's static scanner can see and generate them.
const LEGEND_SWATCH_CLASSES = ['bg-chart-1', 'bg-chart-2', 'bg-chart-3', 'bg-chart-4', 'bg-chart-5'];

export function AnalysisPanel({ chart }: { chart: ChartData }) {
    return (
        <section aria-labelledby="analysis-panel-heading" className="bg-card overflow-hidden rounded-lg border">
            <div className="border-b px-4 py-4 sm:px-5">
                <h2 id="analysis-panel-heading" className="text-base font-semibold">
                    {chart.question}
                </h2>
            </div>

            <div className="px-4 py-4 sm:px-5">
                {chart.status === 'loading' && <Skeleton className={`${CHART_HEIGHT} w-full`} />}

                {chart.status === 'empty' && (
                    <div className={`${CHART_HEIGHT} flex flex-col items-center justify-center text-center`}>
                        <p className="text-sm font-semibold">No data for this range</p>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Once onboardings start and complete, this chart will fill in.
                        </p>
                    </div>
                )}

                {chart.status === 'error' && (
                    <div className={`${CHART_HEIGHT} flex flex-col items-center justify-center text-center`}>
                        <p className="text-sm font-semibold">{ERROR_DETAIL}</p>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            onClick={() => router.reload()}
                        >
                            Try again
                        </Button>
                    </div>
                )}

                {chart.status === 'ready' && (
                    <>
                        <div className={`${CHART_HEIGHT} w-full`}>
                            <Chart
                                labels={chart.labels}
                                series={chart.series}
                                ariaLabel={`${chart.question} ${chart.series
                                    .map((s) => `${s.label}: ${s.data.join(', ')}`)
                                    .join('. ')}`}
                            />
                        </div>

                        <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                            {chart.series.map((s, index) => (
                                <li key={s.label} className="text-muted-foreground flex items-center gap-2 text-sm">
                                    <span
                                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${LEGEND_SWATCH_CLASSES[index % LEGEND_SWATCH_CLASSES.length]}`}
                                        aria-hidden="true"
                                    />
                                    {s.label}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </section>
    );
}
