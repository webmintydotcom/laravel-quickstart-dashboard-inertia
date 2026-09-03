import { useEffect, useRef } from 'react';
import ChartJS from 'chart.js/auto';

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

            // The global prefers-reduced-motion rule in app.css governs CSS
            // animation and does not reach canvas rendering.
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            chartRef.current = new ChartJS(canvas, {
                type: 'line',
                data: {
                    labels,
                    datasets: series.map((s, index) => ({
                        label: s.label,
                        data: s.data,
                        borderColor: token(index + 1),
                        backgroundColor: token(index + 1),
                        tension: 0.3,
                    })),
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: reduceMotion ? false : undefined,
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
        // eslint-disable-next-line react-hooks/exhaustive-deps -- dataKey is the
        // intentional, stable stand-in for labels/series; see comment above.
    }, [dataKey]);

    return <canvas ref={canvasRef} role="img" aria-label={ariaLabel} />;
}
