import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { route } from 'ziggy-js';

import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/AuthLayout';

export default function ConfirmPassword() {
    const form = useForm({
        password: '',
    });

    function submit(event: FormEvent) {
        event.preventDefault();

        form.post(route('password.confirm.store'), {
            onFinish: () => form.reset('password'),
        });
    }

    return (
        <AuthLayout title="Confirm password" description="This is a secure area. Confirm your password to continue.">
            <form onSubmit={submit} className="space-y-4">
                <FormField
                    id="password"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    autoFocus
                    required
                    error={form.errors.password}
                    value={form.data.password}
                    onChange={(event) => form.setData('password', event.target.value)}
                />

                <Button type="submit" className="w-full" disabled={form.processing} aria-busy={form.processing}>
                    Confirm password
                </Button>
            </form>
        </AuthLayout>
    );
}
