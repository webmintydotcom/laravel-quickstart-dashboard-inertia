import { useEffect, useRef } from 'react';
import ChartJS from 'chart.js/auto';

// Only --chart-1 through --chart-5 are defined in resources/css/app.css. Wrapping
// the series index against this count - here and in analysis-panel.tsx's legend -
// keeps a sixth series' line colour and legend swatch in agreement instead of
// silently diverging.
export const CHART_TOKEN_COUNT = 5;

interface Series {
    label: string;
    data: number[];
}

interface ChartProps {
    labels: string[];
    series: Series[];
    /** States what the chart shows AND its headline conclusion. */
    ariaLabel: string;
}

export function Chart({ labels, series, ariaLabel }: ChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<ChartJS | null>(null);

    // `labels`/`series` are prop arrays with no guaranteed identity across
    // renders. Keying the effect on them directly would tear the chart down and
    // rebuild it on every render that hands down new array instances, not just
    // on mount. Serializing into one stable string collapses that to real data
    // changes only.
    const dataKey = JSON.stringify({ labels, series });

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const build = () => {
            chartRef.current?.destroy();

            // Chart.js takes concrete colours and cannot read var(--chart-1), and
            // DESIGN.md forbids raw hex in component files - so resolve the tokens
            // from the document element at draw time.
            const styles = getComputedStyle(document.documentElement);
            const token = (n: number) => styles.getPropertyValue(`--chart-${n}`).trim();
            const themeToken = (name: string) => styles.getPropertyValue(`--${name}`).trim();

            // Chart.js defaults its ticks and grid lines to fixed greys, which
            // vanish against the dark card. Both are re-read on every build(),
            // so they follow the theme along with the series colours.
            const tickColor = themeToken('muted-foreground');
            const gridColor = themeToken('border');

            // The global prefers-reduced-motion rule in app.css governs CSS
            // animation and does not reach canvas rendering. jsdom does not
            // implement matchMedia, so guard the same way AppLayout.tsx does.
            const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

            chartRef.current = new ChartJS(canvas, {
                type: 'line',
                data: {
                    labels,
                    datasets: series.map((s, index) => ({
                        label: s.label,
                        data: s.data,
                        borderColor: token((index % CHART_TOKEN_COUNT) + 1),
                        backgroundColor: token((index % CHART_TOKEN_COUNT) + 1),
                        tension: 0.3,
                    })),
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: reduceMotion ? false : undefined,
                    // The panel renders its own legend beneath the canvas so the
                    // swatches can use the same tokens as the lines; Chart.js's
                    // built-in one would be a second copy of it.
                    plugins: { legend: { display: false } },
                    scales: {
                        x: {
                            border: { color: gridColor },
                            grid: { display: false },
                            ticks: { color: tickColor },
                        },
                        y: {
                            beginAtZero: true,
                            border: { display: false },
                            grid: { color: gridColor },
                            ticks: { color: tickColor },
                        },
                    },
                },
            });
        };

        build();

        // The theme is applied by setting a class on the document element, and the
        // chart tokens differ between light and dark. Without this, a chart drawn
        // in one theme keeps its colours after switching.
        const observer = new MutationObserver(build);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => {
            observer.disconnect();
            chartRef.current?.destroy();
            chartRef.current = null;
        };
        // dataKey is the intentional, stable stand-in for labels/series; see
        // comment above.
    }, [dataKey]);

    return <canvas ref={canvasRef} role="img" aria-label={ariaLabel} />;
}
