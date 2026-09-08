import { Link, router, usePage } from '@inertiajs/react';
import { LogOut, Settings, UserCircle } from 'lucide-react';
import { route } from 'ziggy-js';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { SharedProps } from '@/types';

export function UserMenu() {
    const { auth } = usePage<SharedProps>().props;

    if (!auth.user) {
        return null;
    }

    const initials = `${auth.user.first_name.charAt(0)}${auth.user.last_name.charAt(0)}`.toUpperCase();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                aria-label={`Account menu for ${auth.user.name}`}
                className="flex min-h-11 items-center gap-2 rounded-md px-2 hover:bg-white/10"
            >
                {auth.user.avatar_url ? (
                    <img src={auth.user.avatar_url} alt="" className="size-8 shrink-0 rounded-full object-cover" />
                ) : (
                    <span className="bg-mint-500 text-mint-950 grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold">
                        {initials}
                    </span>
                )}
                <span className="hidden text-sm sm:block">{auth.user.name}</span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                    <p className="text-sm font-medium">{auth.user.name}</p>
                    <p className="text-muted-foreground truncate text-xs">{auth.user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={route('profile')}>
                        <UserCircle aria-hidden="true" />
                        Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={route('settings')}>
                        <Settings aria-hidden="true" />
                        Settings
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => router.post(route('logout'))}>
                    <LogOut aria-hidden="true" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
