import AppLayout from '@/layouts/AppLayout';
import { BrowserSessions } from '@/components/profile/browser-sessions';
import { DeleteAccountForm } from '@/components/profile/delete-account-form';
import { UpdateAvatarForm } from '@/components/profile/update-avatar-form';
import { UpdatePasswordForm } from '@/components/profile/update-password-form';
import { UpdateProfileInformationForm } from '@/components/profile/update-profile-information-form';
import type { Session, User } from '@/types';

interface ProfileProps {
    profile: User;
    sessions: Session[];
}

export default function Profile({ profile, sessions }: ProfileProps) {
    return (
        <AppLayout title="Profile">
            <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">Profile</h1>
                <p className="text-muted-foreground mt-2 text-sm">
                    Your account details, security, and active sessions.
                </p>

                <div className="mt-6 space-y-6">
                    <UpdateProfileInformationForm profile={profile} />
                    <UpdateAvatarForm profile={profile} />
                    <UpdatePasswordForm />
                    <BrowserSessions sessions={sessions} />
                    <DeleteAccountForm />
                </div>
            </div>
        </AppLayout>
    );
}
