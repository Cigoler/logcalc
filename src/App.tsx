import { useSettings } from '@/hooks/use-settings';
import { useLogHistory } from '@/hooks/use-log-history';
import { WelcomeCard } from '@/components/dashboard/welcome-card';
import { StatCard } from '@/components/dashboard/stat-card';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { ProductionChart } from '@/components/dashboard/production-chart';

export default function App() {
  const { settings } = useSettings();
  const { history } = useLogHistory();

  // Calculate analytics
  const totalEntries = history.entries.length;
  const totalLogs = history.entries.reduce((sum, entry) => sum + (entry.actualLogs || 0), 0);
  const averageSpeed = history.entries.reduce((sum, entry) => sum + entry.speed, 0) / (totalEntries || 1);
  
  // Calculate efficiency
  const totalTargetLogs = history.entries.reduce((sum, entry) => sum + entry.targetLogs, 0);
  const efficiency = totalTargetLogs ? (totalLogs / totalTargetLogs * 100) : 0;

  // Get recent entries
  const recentEntries = history.entries.slice(0, 5);

  return (
    <div className="container max-w-6xl space-y-6">
      <WelcomeCard />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Logs Produced"
          value={Math.round(totalLogs).toLocaleString()}
          description={`Across ${totalEntries} production runs`}
        />
        <StatCard
          title="Average Speed"
          value={`${Math.round(averageSpeed)} RPM`}
          description="Overall production average"
        />
        <StatCard
          title="Efficiency Rate"
          value={`${efficiency.toFixed(1)}%`}
          description="Actual vs Target Production"
        />
        <StatCard
          title="Material Types"
          value={settings.diameters.length}
          description="Configured diameters"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ProductionChart entries={history.entries} />
        <ActivityFeed entries={recentEntries} />
      </div>
    </div>
  );
}