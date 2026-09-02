import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { route } from 'ziggy-js';

import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/AuthLayout';

export default function Register() {
    const form = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    function submit(event: FormEvent) {
        event.preventDefault();

        form.post(route('register.store'), {
            onFinish: () => form.reset('password', 'password_confirmation'),
        });
    }

    return (
        <AuthLayout title="Create an account" description="A few details and you're in.">
            <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <FormField
                        id="first_name"
                        label="First name"
                        autoComplete="given-name"
                        autoFocus
                        required
                        error={form.errors.first_name}
                        value={form.data.first_name}
                        onChange={(event) => form.setData('first_name', event.target.value)}
                    />

                    <FormField
                        id="last_name"
                        label="Last name"
                        autoComplete="family-name"
                        required
                        error={form.errors.last_name}
                        value={form.data.last_name}
                        onChange={(event) => form.setData('last_name', event.target.value)}
                    />
                </div>

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
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    required
                    error={form.errors.password}
                    value={form.data.password}
                    onChange={(event) => form.setData('password', event.target.value)}
                />

                <FormField
                    id="password_confirmation"
                    label="Confirm password"
                    type="password"
                    autoComplete="new-password"
                    required
                    error={form.errors.password_confirmation}
                    value={form.data.password_confirmation}
                    onChange={(event) => form.setData('password_confirmation', event.target.value)}
                />

                <Button type="submit" className="w-full" disabled={form.processing} aria-busy={form.processing}>
                    Create account
                </Button>

                <p className="text-muted-foreground text-center text-sm">
                    Already have an account?{' '}
                    <Link href={route('login')} className="text-primary hover:underline">
                        Log in
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
