import { Link, router, usePage } from '@inertiajs/react';
import { LogOut, Settings, UserCircle } from 'lucide-react';
import { route } from 'ziggy-js';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from '@/components/ui/menu';
import type { SharedProps } from '@/types';

export function UserMenu() {
    const { auth } = usePage<SharedProps>().props;

    if (!auth.user) {
        return null;
    }

    const initials = `${auth.user.first_name.charAt(0)}${auth.user.last_name.charAt(0)}`.toUpperCase();

    return (
        <Menu>
            <MenuTrigger
                aria-label={`Account menu for ${auth.user.name}`}
                className="flex min-h-11 items-center gap-2 rounded-md px-2 hover:bg-white/10"
            >
                <Avatar className="bg-transparent after:hidden">
                    {auth.user.avatar_url && <AvatarImage src={auth.user.avatar_url} alt="" />}
                    <AvatarFallback className="bg-mint-500 text-mint-950 font-semibold">{initials}</AvatarFallback>
                </Avatar>
                <span className="hidden text-sm sm:block">{auth.user.name}</span>
            </MenuTrigger>

            <MenuContent className="w-56">
                <div className="px-2.5 py-1.5">
                    <p className="text-sm font-medium">{auth.user.name}</p>
                    <p className="text-muted-foreground truncate text-xs">{auth.user.email}</p>
                </div>
                <MenuSeparator />
                <MenuItem value="profile" asChild>
                    <Link href={route('profile')}>
                        <UserCircle aria-hidden="true" />
                        Profile
                    </Link>
                </MenuItem>
                <MenuItem value="settings" asChild>
                    <Link href={route('settings')}>
                        <Settings aria-hidden="true" />
                        Settings
                    </Link>
                </MenuItem>
                <MenuSeparator />
                <MenuItem value="logout" onSelect={() => router.post(route('logout'))}>
                    <LogOut aria-hidden="true" />
                    Log out
                </MenuItem>
            </MenuContent>
        </Menu>
    );
}
