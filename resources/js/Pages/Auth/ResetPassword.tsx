import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { route } from 'ziggy-js';

import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/AuthLayout';

interface ResetPasswordProps {
    token: string;
    email: string | null;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const form = useForm({
        token,
        email: email ?? '',
        password: '',
        password_confirmation: '',
    });

    function submit(event: FormEvent) {
        event.preventDefault();

        form.post(route('password.update'), {
            onFinish: () => form.reset('password', 'password_confirmation'),
        });
    }

    return (
        <AuthLayout title="Reset password" description="Choose a new password for your account.">
            <form onSubmit={submit} className="space-y-4">
                <FormField
                    id="email"
                    label="Email"
                    type="email"
                    autoComplete="username"
                    required
                    error={form.errors.email}
                    value={form.data.email}
                    onChange={(event) => form.setData('email', event.target.value)}
                />

                <FormField
                    id="password"
                    label="New password"
                    type="password"
                    autoComplete="new-password"
                    autoFocus
                    required
                    error={form.errors.password}
                    value={form.data.password}
                    onChange={(event) => form.setData('password', event.target.value)}
                />

                <FormField
                    id="password_confirmation"
                    label="Confirm new password"
                    type="password"
                    autoComplete="new-password"
                    required
                    error={form.errors.password_confirmation}
                    value={form.data.password_confirmation}
                    onChange={(event) => form.setData('password_confirmation', event.target.value)}
                />

                <Button type="submit" className="w-full" disabled={form.processing} aria-busy={form.processing}>
                    Reset password
                </Button>
            </form>
        </AuthLayout>
    );
}
