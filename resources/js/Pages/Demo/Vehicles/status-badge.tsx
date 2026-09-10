import { Badge } from '@/components/ui/badge';

const VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    available: 'default',
    in_service: 'secondary',
    in_maintenance: 'outline',
    retired: 'destructive',
};

/**
 * The status pill, shared by the list and the detail page so the two never
 * drift into showing the same status two different ways.
 */
export function StatusBadge({ status, label }: { status: string; label: string }) {
    return <Badge variant={VARIANTS[status] ?? 'outline'}>{label}</Badge>;
}
