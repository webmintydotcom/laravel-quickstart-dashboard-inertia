import * as React from 'react';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

type FormFieldProps = Omit<
    React.ComponentProps<'input'>,
    'id' | 'aria-invalid' | 'aria-describedby' | 'className' | 'size'
> & {
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

/**
 * A labelled text input built on Shark's Field. Field (Ark UI) wires the
 * label's `for`, the input's `aria-invalid`/`aria-errormessage`, and the
 * error text's id from the ids given here, so they stay the same as before
 * (`{id}` and `{id}-error`).
 */
function FormField({ id, label, error, labelSuffix, className, required, disabled, ...props }: FormFieldProps) {
    const errorId = `${id}-error`;
    const invalid = Boolean(error);

    const labelElement = <FieldLabel>{label}</FieldLabel>;

    return (
        <Field
            id={id}
            ids={{ errorText: errorId }}
            invalid={invalid}
            required={required}
            disabled={disabled}
            className={className}
        >
            {labelSuffix ? (
                <div className="flex items-center justify-between">
                    {labelElement}
                    {labelSuffix}
                </div>
            ) : (
                labelElement
            )}

            <Input size="lg" aria-describedby={invalid ? errorId : undefined} {...props} />

            <FieldError>{error}</FieldError>
        </Field>
    );
}

export { FormField };
