import { useSettings } from '@/hooks/use-settings';
import { LogEntry } from '@/types/log-entry';
import { formatDate } from '@/utils/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react';

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
            
            let VarianceIcon = MinusIcon;
            let varianceColor = 'text-muted-foreground';
            
            if (variance > 2) {
              VarianceIcon = ArrowUpIcon;
              varianceColor = 'text-green-500';
            } else if (variance < -2) {
              VarianceIcon = ArrowDownIcon;
              varianceColor = 'text-red-500';
            }

            return (
              <div key={entry.id} className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {diameter?.diameter}mm at {entry.speed} RPM
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(entry.timestamp)}
                    </span>
                    {entry.notes && (
                      <Badge variant="secondary" className="text-xs">
                        Has notes
                      </Badge>
                    )}
                  </div>
                </div>
                <div className={`ml-auto flex items-center gap-1 font-medium ${varianceColor}`}>
                  <VarianceIcon className="h-4 w-4" />
                  {variance.toFixed(1)}%
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