import { useForm } from '@inertiajs/react';
import type { ChangeEvent } from 'react';
import { useRef } from 'react';
import { route } from 'ziggy-js';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { User } from '@/types';

interface Props {
    profile: User;
}

export function UpdateAvatarForm({ profile }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    const {
        setData,
        post,
        delete: destroy,
        processing,
        errors,
    } = useForm({
        avatar: null as File | null,
    });

    const initials = `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();

    const submitOptions = {
        preserveScroll: true,
        errorBag: 'updateAvatar',
        onFinish: () => {
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        },
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;

        if (!file) {
            return;
        }

        setData('avatar', file);
        // Inertia only switches the request to multipart when it detects a
        // File in the data it's about to serialize on its own; being explicit
        // here avoids a silent JSON submission that the backend can't parse.
        post(route('profile.avatar.store'), { ...submitOptions, forceFormData: true });
    };

    const handleRemove = () => {
        destroy(route('profile.avatar.destroy'), submitOptions);
    };

    return (
        <Card>
            <CardContent>
                <h2 className="text-base font-semibold">Photo</h2>
                <p className="text-muted-foreground mt-1 text-sm">A photo helps teammates recognise you.</p>

                <div className="mt-4 flex items-center gap-4">
                    {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="" className="size-16 shrink-0 rounded-full object-cover" />
                    ) : (
                        <span className="bg-mint-500 text-mint-950 grid size-16 shrink-0 place-items-center rounded-full text-lg font-semibold">
                            {initials}
                        </span>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                        <label
                            htmlFor="avatar"
                            className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex min-h-11 cursor-pointer items-center rounded-md border px-4 text-sm font-medium shadow-xs"
                        >
                            Choose photo
                        </label>
                        <input
                            ref={inputRef}
                            id="avatar"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="sr-only"
                            aria-invalid={Boolean(errors.avatar)}
                            aria-describedby={errors.avatar ? 'avatar-error' : undefined}
                            disabled={processing}
                            onChange={handleFileChange}
                        />

                        {profile.avatar_url && (
                            <Button
                                type="button"
                                variant="outline"
                                className="min-h-11"
                                disabled={processing}
                                onClick={handleRemove}
                            >
                                Remove
                            </Button>
                        )}
                    </div>
                </div>

                {errors.avatar && (
                    <p id="avatar-error" className="text-destructive mt-2 text-sm">
                        {errors.avatar}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
