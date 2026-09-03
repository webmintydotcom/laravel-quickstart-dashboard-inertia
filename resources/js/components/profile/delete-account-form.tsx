import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useRef, useState } from 'react';
import { route } from 'ziggy-js';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { FormField } from '@/components/form-field';

export function DeleteAccountForm() {
    const [open, setOpen] = useState(false);
    const cancelRef = useRef<HTMLButtonElement>(null);

    const { data, setData, delete: destroy, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        destroy(route('profile.destroy'), {
            errorBag: 'deleteAccount',
            // A plaintext password must never sit in component state after the
            // request settles, so it's cleared on both outcomes. A successful
            // delete navigates away entirely, but a failed attempt leaves this
            // component mounted.
            onSuccess: () => reset('password'),
            onError: () => reset('password'),
        });
    };

    return (
        <Card className="border-destructive/50">
            <CardContent className="p-5">
                <h2 className="text-destructive text-base font-semibold">Delete account</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                    Permanently delete your account and everything associated with it. This cannot be undone.
                </p>

                <Dialog open={open} onOpenChange={setOpen}>
                    <Button
                        type="button"
                        variant="destructive"
                        className="mt-4 min-h-11"
                        onClick={() => setOpen(true)}
                    >
                        Delete account
                    </Button>

                    <DialogContent
                        onOpenAutoFocus={(event) => {
                            event.preventDefault();
                            cancelRef.current?.focus();
                        }}
                    >
                        <form onSubmit={submit}>
                            <DialogHeader>
                                <DialogTitle>Delete your account?</DialogTitle>
                                <DialogDescription>
                                    This permanently deletes your account and all associated data. This cannot be
                                    undone. Enter your password to confirm.
                                </DialogDescription>
                            </DialogHeader>

                            <FormField
                                id="delete-account-password"
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                value={data.password}
                                error={errors.password}
                                onChange={(event) => setData('password', event.target.value)}
                                className="mt-4"
                            />

                            <DialogFooter className="mt-6">
                                <Button
                                    ref={cancelRef}
                                    type="button"
                                    variant="outline"
                                    className="min-h-11"
                                    onClick={() => {
                                        reset('password');
                                        setOpen(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" variant="destructive" className="min-h-11" disabled={processing}>
                                    Delete account
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
