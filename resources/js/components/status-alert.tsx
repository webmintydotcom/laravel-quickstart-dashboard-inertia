import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface StatusAlertProps {
    /** The shared `flash.status` prop; nothing renders when it is null. */
    status: string | null;
    className?: string;
}

/**
 * Announces a flashed status message. Alert already carries role="alert", so the
 * message reaches assistive technology instead of only appearing on screen.
 */
function StatusAlert({ status, className }: StatusAlertProps) {
    if (!status) {
        return null;
    }

    return (
        <Alert className={cn('bg-accent text-accent-foreground mb-4', className)}>
            <AlertDescription className="text-accent-foreground">{status}</AlertDescription>
        </Alert>
    );
}

export { StatusAlert };
