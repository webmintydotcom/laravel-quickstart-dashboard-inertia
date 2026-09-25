import { Link, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { route } from 'ziggy-js';

import { FormField } from '@/components/form-field';
import { StatusAlert } from '@/components/status-alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel } from '@/components/ui/field';
import AuthLayout from '@/layouts/AuthLayout';
import type { SharedProps } from '@/types';

export default function Login() {
    const { flash } = usePage<SharedProps>().props;

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

                <FormField
                    id="password"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    required
                    error={form.errors.password}
                    labelSuffix={
                        <Link
                            href={route('password.request')}
                            className="text-muted-foreground text-sm hover:underline"
                        >
                            Forgot password?
                        </Link>
                    }
                    value={form.data.password}
                    onChange={(event) => form.setData('password', event.target.value)}
                />

                <Field id="remember" orientation="horizontal">
                    <Checkbox
                        name="remember"
                        checked={form.data.remember}
                        onCheckedChange={({ checked }) => form.setData('remember', checked === true)}
                    />
                    <FieldLabel className="font-normal">Remember me</FieldLabel>
                </Field>

                <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    isLoading={form.processing}
                    disabled={form.processing}
                >
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
