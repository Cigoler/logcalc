import { useSettings } from '@/hooks/use-settings';
import { LogEntry } from '@/types/log-entry';
import { formatDate } from '@/utils/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivityFeedProps {
  entries: LogEntry[];
}

export function ActivityFeed({ entries }: ActivityFeedProps) {
  const { settings } = useSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {entries.map(entry => {
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

          {entries.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No production runs recorded yet. Start by using the calculator to track your production.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}