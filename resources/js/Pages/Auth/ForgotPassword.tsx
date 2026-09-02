import { Link, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { route } from 'ziggy-js';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
            {flash.status && (
                <div className="bg-accent text-accent-foreground mb-4 rounded-md px-3 py-2 text-sm">{flash.status}</div>
            )}

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

                <Button type="submit" className="w-full" disabled={form.processing}>
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
