import { useSettings } from '@/hooks/use-settings';
import { useLogHistory } from '@/hooks/use-log-history';
import { WelcomeCard } from '@/components/dashboard/welcome-card';
import { StatCard } from '@/components/dashboard/stat-card';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { ProductionChart } from '@/components/dashboard/production-chart';
import { startOfDay, subDays } from 'date-fns';

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

  // Calculate trends
  const today = startOfDay(new Date());
  const yesterday = subDays(today, 1);
  
  const todayEntries = history.entries.filter(entry => entry.timestamp >= today.getTime());
  const yesterdayEntries = history.entries.filter(entry => {
    const timestamp = entry.timestamp;
    return timestamp >= yesterday.getTime() && timestamp < today.getTime();
  });

  const calculateEfficiency = (entries: typeof history.entries) => {
    const target = entries.reduce((sum, entry) => sum + entry.targetLogs, 0);
    const actual = entries.reduce((sum, entry) => sum + (entry.actualLogs || 0), 0);
    return target ? (actual / target * 100) : 0;
  };

  const todayEfficiency = calculateEfficiency(todayEntries);
  const yesterdayEfficiency = calculateEfficiency(yesterdayEntries);
  const efficiencyTrend = yesterdayEfficiency 
    ? ((todayEfficiency - yesterdayEfficiency) / yesterdayEfficiency * 100)
    : 0;

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
          trend={{
            value: Math.round(efficiencyTrend),
            label: "vs yesterday"
          }}
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