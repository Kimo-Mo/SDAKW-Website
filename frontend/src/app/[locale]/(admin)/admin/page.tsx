import { OverviewMetrics } from '@/components/admin/overview-metrics';
import { AdminQuickActions } from '@/components/admin/quick-actions';

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Portfolio Summary Metrics */}
      <OverviewMetrics />

      {/* Quick Action Shortcuts */}
      <AdminQuickActions />
    </div>
  );
}
