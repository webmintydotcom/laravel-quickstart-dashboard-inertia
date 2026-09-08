import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { route } from 'ziggy-js';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FormField } from '@/components/form-field';

export function UpdatePasswordForm() {
    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        put(route('user-password.update'), {
            preserveScroll: true,
            errorBag: 'updatePassword',
            // A plaintext password must never sit in component state after the
            // request settles, so it's cleared on both outcomes.
            onSuccess: () => reset('current_password', 'password', 'password_confirmation'),
            onError: () => reset('current_password', 'password', 'password_confirmation'),
        });
    };

    return (
        <Card>
            <CardContent>
                <h2 className="text-base font-semibold">Password</h2>
                <p className="text-muted-foreground mt-1 text-sm">Update your account password.</p>

                <form onSubmit={submit} className="mt-4 max-w-md space-y-4">
                    <FormField
                        id="current_password"
                        label="Current password"
                        type="password"
                        autoComplete="current-password"
                        value={data.current_password}
                        error={errors.current_password}
                        onChange={(event) => setData('current_password', event.target.value)}
                    />
                    <FormField
                        id="password"
                        label="New password"
                        type="password"
                        autoComplete="new-password"
                        value={data.password}
                        error={errors.password}
                        onChange={(event) => setData('password', event.target.value)}
                    />
                    <FormField
                        id="password_confirmation"
                        label="Confirm new password"
                        type="password"
                        autoComplete="new-password"
                        value={data.password_confirmation}
                        error={errors.password_confirmation}
                        onChange={(event) => setData('password_confirmation', event.target.value)}
                    />

                    <Button type="submit" className="min-h-11" disabled={processing}>
                        Save
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
