import { Badge, type BadgeVariant } from '@/components/ui/badge';

// Shark's tinted status variants read as a traffic light: ready, busy, needs
// attention, gone.
const VARIANTS: Record<string, BadgeVariant> = {
    available: 'success',
    in_service: 'info',
    in_maintenance: 'warning',
    retired: 'destructive',
};

/**
 * The status pill, shared by the list and the detail page so the two never
 * drift into showing the same status two different ways.
 */
export function StatusBadge({ status, label }: { status: string; label: string }) {
    return <Badge variant={VARIANTS[status] ?? 'outline'}>{label}</Badge>;
}
