import * as React from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type FormFieldProps = Omit<React.ComponentProps<'input'>, 'id' | 'aria-invalid' | 'aria-describedby' | 'className'> & {
    /** Also used to derive the id of the error message the input points at. */
    id: string;
    label: React.ReactNode;
    /** The message for this field, straight from Inertia's `form.errors`. */
    error?: string;
    /** Rendered opposite the label, for things like a "Forgot password?" link. */
    labelSuffix?: React.ReactNode;
    /** Classes for the field wrapper, not the input. */
    className?: string;
};

function FormField({ id, label, error, labelSuffix, className, ...props }: FormFieldProps) {
    const errorId = `${id}-error`;

    const labelElement = (
        <label htmlFor={id} className="text-sm font-medium">
            {label}
        </label>
    );

    return (
        <div className={cn('space-y-2', className)}>
            {labelSuffix ? (
                <div className="flex items-center justify-between">
                    {labelElement}
                    {labelSuffix}
                </div>
            ) : (
                labelElement
            )}

            <Input id={id} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...props} />

            {error && (
                <p id={errorId} className="text-destructive text-sm">
                    {error}
                </p>
            )}
        </div>
    );
}

export { FormField };
