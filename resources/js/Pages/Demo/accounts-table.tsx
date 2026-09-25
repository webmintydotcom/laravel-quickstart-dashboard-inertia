import { AlertTriangle, CheckCircle2, Clock, Info, type LucideIcon } from 'lucide-react';

import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import type { AccountRow, Accounts } from './Dashboard';
import { PanelEmpty, PanelError } from './panel-state';

const ERROR_DETAIL = "Couldn't load onboarding accounts.";

function statusVisual(status: string): { icon: LucideIcon; variant: BadgeVariant } {
    switch (status) {
        case 'Completed':
            return { icon: CheckCircle2, variant: 'success' };
        case 'Stalled':
            return { icon: AlertTriangle, variant: 'destructive' };
        case 'In progress':
            return { icon: Clock, variant: 'info' };
        default:
            return { icon: Info, variant: 'outline' };
    }
}

function StatusLabel({ status }: { status: string }) {
    const { icon: StatusIcon, variant } = statusVisual(status);

    return (
        <Badge variant={variant} size="lg">
            <StatusIcon aria-hidden="true" />
            {status}
        </Badge>
    );
}

export function AccountsTable({ accounts }: { accounts: Accounts }) {
    return (
        <Card asChild className="gap-0 overflow-hidden rounded-lg py-0">
            <section
                id="accounts-table"
                aria-labelledby="accounts-table-heading"
                aria-busy={accounts.status === 'loading'}
            >
                <CardHeader className="min-h-11 items-center border-b px-4 py-4 sm:px-5">
                    <CardTitle asChild className="text-base">
                        <h2 id="accounts-table-heading">Onboarding accounts</h2>
                    </CardTitle>
                </CardHeader>

                {accounts.status === 'loading' && (
                    <div className="divide-y">
                        <span className="sr-only">Loading onboarding accounts…</span>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
                                <div className="min-w-0 flex-1 space-y-2">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                                <Skeleton className="h-4 w-20 shrink-0" />
                            </div>
                        ))}
                    </div>
                )}

                {accounts.status === 'empty' && (
                    <PanelEmpty
                        title="Start your first onboarding"
                        detail="Every account moving from signed contract to live use will appear here."
                        className="py-10"
                    />
                )}

                {accounts.status === 'error' && <PanelError detail={ERROR_DETAIL} className="py-10" />}

                {accounts.status === 'ready' && (
                    <>
                        {/* md and above: a real table. */}
                        <div className="hidden md:block">
                            {/*
                            The table's cells default to an 8px gutter, which does not
                            line up with the panel header's 16/20px. Set the gutter once
                            on the table rather than on every cell.
                        */}
                            <Table className="[&_td]:px-4 sm:[&_td]:px-5 [&_th]:px-4 sm:[&_th]:px-5">
                                <TableCaption className="px-4 pb-4 sm:px-5">
                                    Onboarding accounts, from signed contract to live use.
                                </TableCaption>
                                <TableHeader className="bg-muted/60">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead scope="col">Account</TableHead>
                                        <TableHead scope="col">Stage</TableHead>
                                        <TableHead scope="col">Owner</TableHead>
                                        <TableHead scope="col">Started</TableHead>
                                        <TableHead scope="col">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {accounts.rows.map((row) => (
                                        <TableRow key={row.name}>
                                            <TableCell className="text-foreground font-medium whitespace-normal">
                                                {row.name}
                                            </TableCell>
                                            <TableCell>{row.stage}</TableCell>
                                            <TableCell>{row.owner}</TableCell>
                                            <TableCell>{row.started}</TableCell>
                                            <TableCell>
                                                <StatusLabel status={row.status} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Below md: labelled record rows instead of a scrolling table. */}
                        <ul className="divide-y md:hidden">
                            {accounts.rows.map((row) => (
                                <AccountRecordRow key={row.name} row={row} />
                            ))}
                        </ul>
                    </>
                )}
            </section>
        </Card>
    );
}

function AccountRecordRow({ row }: { row: AccountRow }) {
    return (
        <li className="px-4 py-4 sm:px-5">
            <p className="text-foreground text-sm font-semibold">{row.name}</p>
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm">
                <dt className="text-muted-foreground">Stage</dt>
                <dd>{row.stage}</dd>

                <dt className="text-muted-foreground">Owner</dt>
                <dd>{row.owner}</dd>

                <dt className="text-muted-foreground">Started</dt>
                <dd>{row.started}</dd>

                <dt className="text-muted-foreground">Status</dt>
                <dd>
                    <StatusLabel status={row.status} />
                </dd>
            </dl>
        </li>
    );
}
