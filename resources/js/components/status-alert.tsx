import { CircleCheckIcon } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface StatusAlertProps {
    /** The shared `flash.status` prop; nothing renders when it is null. */
    status: string | null;
    className?: string;
}

/**
 * Announces a flashed status message. Shark's Alert is a plain div, so
 * role="alert" is set here to make the message reach assistive technology
 * instead of only appearing on screen.
 */
function StatusAlert({ status, className }: StatusAlertProps) {
    if (!status) {
        return null;
    }

    return (
        <Alert role="alert" variant="success" className={cn('mb-4', className)}>
            <CircleCheckIcon aria-hidden />
            <AlertDescription className="text-foreground">{status}</AlertDescription>
        </Alert>
    );
}

export { StatusAlert };
