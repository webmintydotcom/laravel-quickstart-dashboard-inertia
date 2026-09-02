import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { route } from 'ziggy-js';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
                    <div className="space-y-2">
                        <label htmlFor="first_name" className="text-sm font-medium">
                            First name
                        </label>
                        <Input
                            id="first_name"
                            autoComplete="given-name"
                            autoFocus
                            required
                            aria-invalid={Boolean(form.errors.first_name)}
                            value={form.data.first_name}
                            onChange={(event) => form.setData('first_name', event.target.value)}
                        />
                        {form.errors.first_name && <p className="text-destructive text-sm">{form.errors.first_name}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="last_name" className="text-sm font-medium">
                            Last name
                        </label>
                        <Input
                            id="last_name"
                            autoComplete="family-name"
                            required
                            aria-invalid={Boolean(form.errors.last_name)}
                            value={form.data.last_name}
                            onChange={(event) => form.setData('last_name', event.target.value)}
                        />
                        {form.errors.last_name && <p className="text-destructive text-sm">{form.errors.last_name}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                        Email
                    </label>
                    <Input
                        id="email"
                        type="email"
                        autoComplete="username"
                        required
                        aria-invalid={Boolean(form.errors.email)}
                        value={form.data.email}
                        onChange={(event) => form.setData('email', event.target.value)}
                    />
                    {form.errors.email && <p className="text-destructive text-sm">{form.errors.email}</p>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                        Password
                    </label>
                    <Input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        aria-invalid={Boolean(form.errors.password)}
                        value={form.data.password}
                        onChange={(event) => form.setData('password', event.target.value)}
                    />
                    {form.errors.password && <p className="text-destructive text-sm">{form.errors.password}</p>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="password_confirmation" className="text-sm font-medium">
                        Confirm password
                    </label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={form.data.password_confirmation}
                        onChange={(event) => form.setData('password_confirmation', event.target.value)}
                    />
                </div>

                <Button type="submit" className="w-full" disabled={form.processing}>
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
