import { useForm } from '@inertiajs/react';
import type { ChangeEvent } from 'react';
import { useRef } from 'react';
import { route } from 'ziggy-js';

import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
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
                            // Styled as a Shark outline button. Focus lands on the sr-only file
                            // input that follows, so its focus ring is mirrored onto this label.
                            className={cn(
                                buttonVariants({ variant: 'outline', size: 'lg' }),
                                'min-h-11 cursor-pointer',
                                'has-[+input:focus-visible]:border-primary has-[+input:focus-visible]:ring-ring/32 has-[+input:focus-visible]:ring-[3px]',
                                processing && 'pointer-events-none opacity-64',
                            )}
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
                                size="lg"
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
