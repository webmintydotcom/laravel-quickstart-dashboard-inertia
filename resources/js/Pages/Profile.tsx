import AppLayout from '@/layouts/AppLayout';

export default function Profile() {
    return (
        <AppLayout title="Profile">
            <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">Profile</h1>
            </div>
        </AppLayout>
    );
}
