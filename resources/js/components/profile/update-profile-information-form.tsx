import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { route } from 'ziggy-js';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FormField } from '@/components/form-field';
import type { User } from '@/types';

interface Props {
    profile: User;
}

export function UpdateProfileInformationForm({ profile }: Props) {
    // `errorBag` on the request below is what scopes validation errors to
    // this form. Five forms share this page; without it, an error from one
    // would render under another form's field (or nowhere at all - useForm's
    // first argument is a history remember-key, not an error bag, despite
    // how it reads).
    const { data, setData, put, processing, errors } = useForm({
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        put(route('user-profile-information.update'), {
            preserveScroll: true,
            errorBag: 'updateProfileInformation',
        });
    };

    return (
        <Card>
            <CardContent>
                <h2 className="text-base font-semibold">Profile information</h2>
                <p className="text-muted-foreground mt-1 text-sm">Your name and email address.</p>

                <form onSubmit={submit} className="mt-4 max-w-md space-y-4">
                    <FormField
                        id="first_name"
                        label="First name"
                        value={data.first_name}
                        error={errors.first_name}
                        onChange={(event) => setData('first_name', event.target.value)}
                    />
                    <FormField
                        id="last_name"
                        label="Last name"
                        value={data.last_name}
                        error={errors.last_name}
                        onChange={(event) => setData('last_name', event.target.value)}
                    />
                    <FormField
                        id="email"
                        label="Email"
                        type="email"
                        value={data.email}
                        error={errors.email}
                        onChange={(event) => setData('email', event.target.value)}
                    />

                    <Button type="submit" className="min-h-11" disabled={processing}>
                        Save
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
