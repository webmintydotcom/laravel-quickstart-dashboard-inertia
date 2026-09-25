import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useRef, useState } from 'react';
import { route } from 'ziggy-js';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { FormField } from '@/components/form-field';
import type { Session } from '@/types';

interface Props {
    sessions: Session[];
}

export function BrowserSessions({ sessions }: Props) {
    const [open, setOpen] = useState(false);
    const cancelRef = useRef<HTMLButtonElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        password: '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        destroy(route('profile.sessions.destroy'), {
            preserveScroll: true,
            errorBag: 'logoutOtherSessions',
            // A plaintext password must never sit in component state after the
            // request settles, so it's cleared on both outcomes.
            onSuccess: () => {
                reset('password');
                setOpen(false);
            },
            onError: () => reset('password'),
        });
    };

    return (
        <Card>
            <CardContent>
                <h2 className="text-base font-semibold">Browser sessions</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                    Where you&apos;re currently signed in. Log out of other devices if any of these look unfamiliar.
                </p>

                {sessions.length === 0 ? (
                    <p className="text-muted-foreground mt-4 text-sm">
                        No sessions to show. This list requires the database session driver (
                        <code>SESSION_DRIVER=database</code>).
                    </p>
                ) : (
                    <ul className="mt-4 divide-y">
                        {sessions.map((session) => (
                            <li
                                key={`${session.ip_address}-${session.last_active}`}
                                className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
                            >
                                <div>
                                    <p className="font-medium">
                                        {session.device}
                                        {session.is_current && (
                                            <span className="text-primary ml-2 text-xs font-semibold">
                                                Current session
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-muted-foreground">
                                        {session.ip_address ?? 'Unknown location'} &middot; {session.last_active}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {sessions.length > 0 && (
                    <Dialog
                        open={open}
                        onOpenChange={(details) => setOpen(details.open)}
                        // Start focus on Cancel so
                        // the destructive action is never one keypress away.
                        initialFocusEl={() => cancelRef.current}
                    >
                        <DialogTrigger asChild>
                            <Button type="button" variant="outline" size="lg" className="mt-4 min-h-11">
                                Log out other devices
                            </Button>
                        </DialogTrigger>

                        <DialogContent>
                            <form onSubmit={submit} className="flex min-h-0 flex-col">
                                <DialogHeader>
                                    <DialogTitle>Log out of other browser sessions?</DialogTitle>
                                    <DialogDescription>
                                        This signs you out on every device except this one. Enter your password to
                                        confirm.
                                    </DialogDescription>
                                </DialogHeader>

                                <DialogBody>
                                    <FormField
                                        id="logout-sessions-password"
                                        label="Password"
                                        type="password"
                                        autoComplete="current-password"
                                        value={data.password}
                                        error={errors.password}
                                        onChange={(event) => setData('password', event.target.value)}
                                    />
                                </DialogBody>

                                <DialogFooter>
                                    <Button
                                        ref={cancelRef}
                                        type="button"
                                        variant="outline"
                                        size="lg"
                                        className="min-h-11"
                                        onClick={() => {
                                            reset('password');
                                            setOpen(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="destructive"
                                        size="lg"
                                        className="min-h-11"
                                        isLoading={processing}
                                        disabled={processing}
                                    >
                                        Log out other devices
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </CardContent>
        </Card>
    );
}
