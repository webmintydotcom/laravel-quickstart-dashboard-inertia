import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Shared empty/error presentation for every panel on the demo dashboard, so a
// cloner adding a fifth panel has one obvious thing to copy instead of four
// slightly different precedents.

interface PanelEmptyProps {
    title: string;
    detail: string;
    /**
     * Vertical sizing for the wrapping container. Most panels pass simple
     * padding ("py-10"); the analysis panel passes a fixed height instead,
     * because a chart genuinely needs somewhere to size itself.
     */
    className: string;
}

export function PanelEmpty({ title, detail, className }: PanelEmptyProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center px-4 text-center sm:px-5', className)}>
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-muted-foreground mt-1 text-sm">{detail}</p>
        </div>
    );
}

interface PanelErrorProps {
    detail: string;
    /** Omit for panels with no retry action of their own - they fall back to a reload hint. */
    onRetry?: () => void;
    className: string;
}

export function PanelError({ detail, onRetry, className }: PanelErrorProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center px-4 text-center sm:px-5', className)}>
            <p className="text-sm font-semibold">{detail}</p>
            {onRetry ? (
                <Button type="button" variant="outline" size="sm" className="mt-3" onClick={onRetry}>
                    Try again
                </Button>
            ) : (
                <p className="text-muted-foreground mt-1 text-sm">Reload the page to try again.</p>
            )}
        </div>
    );
}
