import { Link, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { route } from 'ziggy-js';

import { FormField } from '@/components/form-field';
import { StatusAlert } from '@/components/status-alert';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/AuthLayout';
import type { SharedProps } from '@/types';

export default function ForgotPassword() {
    const { flash } = usePage<SharedProps>().props;

    const form = useForm({
        email: '',
    });

    function submit(event: FormEvent) {
        event.preventDefault();

        form.post(route('password.email'));
    }

    return (
        <AuthLayout title="Forgot password" description="We'll email you a link to choose a new one.">
            <StatusAlert status={flash.status} />

            <form onSubmit={submit} className="space-y-4">
                <FormField
                    id="email"
                    label="Email"
                    type="email"
                    autoComplete="username"
                    autoFocus
                    required
                    error={form.errors.email}
                    value={form.data.email}
                    onChange={(event) => form.setData('email', event.target.value)}
                />

                <Button type="submit" className="w-full" disabled={form.processing} aria-busy={form.processing}>
                    Email password reset link
                </Button>

                <p className="text-muted-foreground text-center text-sm">
                    <Link href={route('login')} className="text-primary hover:underline">
                        Back to log in
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
