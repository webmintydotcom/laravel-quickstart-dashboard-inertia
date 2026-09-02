import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { route } from 'ziggy-js';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import AuthLayout from '@/layouts/AuthLayout';

export default function Login() {
    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function submit(event: FormEvent) {
        event.preventDefault();

        form.post(route('login.store'), {
            onFinish: () => form.reset('password'),
        });
    }

    return (
        <AuthLayout title="Log in" description="Welcome back. Enter your details to continue.">
            <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                        Email
                    </label>
                    <Input
                        id="email"
                        type="email"
                        autoComplete="username"
                        autoFocus
                        required
                        aria-invalid={Boolean(form.errors.email)}
                        value={form.data.email}
                        onChange={(event) => form.setData('email', event.target.value)}
                    />
                    {form.errors.email && <p className="text-destructive text-sm">{form.errors.email}</p>}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="text-sm font-medium">
                            Password
                        </label>
                        <Link
                            href={route('password.request')}
                            className="text-muted-foreground text-sm hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        aria-invalid={Boolean(form.errors.password)}
                        value={form.data.password}
                        onChange={(event) => form.setData('password', event.target.value)}
                    />
                    {form.errors.password && <p className="text-destructive text-sm">{form.errors.password}</p>}
                </div>

                <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                        checked={form.data.remember}
                        onCheckedChange={(checked) => form.setData('remember', checked === true)}
                    />
                    Remember me
                </label>

                <Button type="submit" className="w-full" disabled={form.processing}>
                    Log in
                </Button>

                <p className="text-muted-foreground text-center text-sm">
                    Don't have an account?{' '}
                    <Link href={route('register')} className="text-primary hover:underline">
                        Sign up
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
