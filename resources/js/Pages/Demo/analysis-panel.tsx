import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';

import { Skeleton } from '@/components/ui/skeleton';

import { Chart, CHART_TOKEN_COUNT } from './chart';
import type { Chart as ChartData, ChartSeries } from './Dashboard';
import { PanelEmpty, PanelError } from './panel-state';

const EMPTY_TITLE = 'No data for this range';
const EMPTY_DETAIL = 'Once onboardings start and complete, this chart will fill in.';

// Distinct from the empty copy above: 'unavailable' (the ?state=partial demo)
// means the chart has data but can't be shown right now, while the rest of
// the dashboard stays populated - not that nothing has happened yet.
const UNAVAILABLE_TITLE = "This chart isn't available right now";
const UNAVAILABLE_DETAIL = 'The rest of the dashboard is unaffected - only this panel is stalled.';

const ERROR_DETAIL = "Couldn't load this chart.";

// Fixed height so the canvas has somewhere to size itself: `maintainAspectRatio:
// false` means Chart.js will not derive a height from its own aspect ratio. The
// shared PanelEmpty/PanelError take this as their sizing className too, so the
// chart's empty/unavailable/error states occupy the same space the chart itself
// would.
const CHART_HEIGHT = 'h-64';

// Written as literal class names (not built with template interpolation) so
// Tailwind's static scanner can see and generate them.
const LEGEND_SWATCH_CLASSES = ['bg-chart-1', 'bg-chart-2', 'bg-chart-3', 'bg-chart-4', 'bg-chart-5'];

function first(s: ChartSeries): number | undefined {
    return s.data[0];
}

function last(s: ChartSeries): number | undefined {
    return s.data[s.data.length - 1];
}

// A sighted reader gets the trend from the chart's shape in about a second.
// State it in words, or a screen-reader user is handed the raw numbers and
// left to do the arithmetic themselves.
//
// Deliberately naive: this is a first-vs-last comparison, nothing more. It
// reads fine on this demo's smooth, hand-picked series, but a real series with
// noise wants smoothing (e.g. comparing trailing averages) before you narrate
// a trend from it, or a single outlier point can flip the sentence.
function trendSentence(s: ChartSeries): string {
    const start = first(s);
    const end = last(s);

    if (start === undefined || end === undefined) {
        return `${s.label} has no data for this range`;
    }

    if (end > start) {
        return `${s.label} rose from ${start} to ${end}`;
    }

    if (end < start) {
        return `${s.label} fell from ${start} to ${end}`;
    }

    return `${s.label} held steady at ${start}`;
}

// Names which series is ahead at a given gap (series-a minus series-b): a
// positive gap means `a` leads, negative means `b` leads, and the sign
// comparison below is what lets us say whether they've crossed.
function comparisonSentence(series: ChartSeries[]): string {
    if (series.length !== 2) {
        return '';
    }

    const [a, b] = series;
    const aStart = first(a);
    const bStart = first(b);
    const aEnd = last(a);
    const bEnd = last(b);

    if (aStart === undefined || bStart === undefined || aEnd === undefined || bEnd === undefined) {
        return '';
    }

    const startGap = aStart - bStart;
    const endGap = aEnd - bEnd;
    const leaderOf = (gap: number) => (gap > 0 ? a.label : b.label);
    const trailerOf = (gap: number) => (gap > 0 ? b.label : a.label);

    if (startGap === 0 && endGap === 0) {
        return `${a.label} and ${b.label} matched throughout`;
    }

    if (endGap === 0) {
        return `${a.label} and ${b.label} met by the end`;
    }

    if (startGap === 0) {
        return `${leaderOf(endGap)} pulled ahead of ${trailerOf(endGap)}`;
    }

    if (Math.sign(startGap) !== Math.sign(endGap)) {
        return `${leaderOf(endGap)} overtook ${leaderOf(startGap)}`;
    }

    const gapNarrowed = Math.abs(endGap) < Math.abs(startGap);
    return `${leaderOf(endGap)} stayed ahead of ${trailerOf(endGap)}, and the gap ${gapNarrowed ? 'narrowed' : 'widened'}`;
}

function buildChartAriaLabel(chart: ChartData): string {
    const clauses = [...chart.series.map(trendSentence), comparisonSentence(chart.series)].filter(
        (clause) => clause.length > 0,
    );

    const rawNumbers = chart.series.map((s) => `${s.label}: ${s.data.join(', ')}`).join('. ');

    if (clauses.length === 0 && rawNumbers.length === 0) {
        return chart.question;
    }

    return `${chart.question} ${[...clauses, rawNumbers].filter((part) => part.length > 0).join('. ')}.`;
}

export function AnalysisPanel({ chart }: { chart: ChartData }) {
    return (
        <section
            aria-labelledby="analysis-panel-heading"
            aria-busy={chart.status === 'loading'}
            className="bg-card overflow-hidden rounded-lg border"
        >
            <div className="border-b px-4 py-4 sm:px-5">
                <h2 id="analysis-panel-heading" className="text-base font-semibold">
                    {chart.question}
                </h2>
            </div>

            <div className="px-4 py-4 sm:px-5">
                {chart.status === 'loading' && (
                    <>
                        <span className="sr-only">Loading chart…</span>
                        <Skeleton className={`${CHART_HEIGHT} w-full`} />
                    </>
                )}

                {chart.status === 'empty' && (
                    <PanelEmpty title={EMPTY_TITLE} detail={EMPTY_DETAIL} className={CHART_HEIGHT} />
                )}

                {chart.status === 'unavailable' && (
                    <PanelEmpty title={UNAVAILABLE_TITLE} detail={UNAVAILABLE_DETAIL} className={CHART_HEIGHT} />
                )}

                {chart.status === 'error' && (
                    <PanelError
                        detail={ERROR_DETAIL}
                        // router.reload() preserves the query string, which would land
                        // straight back on ?state=error. The bare route demonstrates an
                        // actual recovery instead of reloading the same failure.
                        onRetry={() => router.get(route('dashboard'))}
                        className={CHART_HEIGHT}
                    />
                )}

                {chart.status === 'ready' && (
                    <>
                        <div className={`${CHART_HEIGHT} w-full`}>
                            <Chart labels={chart.labels} series={chart.series} ariaLabel={buildChartAriaLabel(chart)} />
                        </div>

                        <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                            {chart.series.map((s, index) => (
                                <li key={s.label} className="text-muted-foreground flex items-center gap-2 text-sm">
                                    <span
                                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${LEGEND_SWATCH_CLASSES[index % CHART_TOKEN_COUNT]}`}
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
