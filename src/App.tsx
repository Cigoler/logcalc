import { useSettings } from '@/hooks/use-settings';
import { useLogHistory } from '@/hooks/use-log-history';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/utils/format';

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
      <Card>
        <CardHeader>
          <CardTitle>Welcome to LogCalc</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <p>
                LogCalc is a specialized calculator designed for winder operators to optimize their production efficiency.
                Created by Jordan Seward, this tool helps you:
              </p>
              <ul>
                <li>Calculate optimal winder speeds based on target production rates</li>
                <li>Track actual production against targets</li>
                <li>Monitor efficiency and maintain production logs</li>
                <li>Generate production forecasts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs Produced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(totalLogs).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across {totalEntries} production runs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Speed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(averageSpeed)} RPM</div>
            <p className="text-xs text-muted-foreground">
              Overall production average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{efficiency.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Actual vs Target Production
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Material Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{settings.diameters.length}</div>
            <p className="text-xs text-muted-foreground">
              Configured diameters
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {recentEntries.map(entry => {
              const diameter = settings.diameters.find(d => d.id === entry.diameterId);
              const variance = entry.actualLogs !== null 
                ? ((entry.actualLogs - entry.targetLogs) / entry.targetLogs * 100)
                : 0;

              return (
                <div key={entry.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {diameter?.diameter}mm at {entry.speed} RPM
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(entry.timestamp)}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    <span className={variance >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {variance.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}

            {recentEntries.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No production runs recorded yet. Start by using the calculator to track your production.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}