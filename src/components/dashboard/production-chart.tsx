import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogEntry } from '@/types/log-entry';

interface ProductionChartProps {
  entries: LogEntry[];
}

export function ProductionChart({ entries }: ProductionChartProps) {
  // Group entries by hour
  const hourlyData = entries.reduce((acc, entry) => {
    const hour = new Date(entry.timestamp).getHours();
    if (!acc[hour]) {
      acc[hour] = {
        actual: 0,
        target: 0,
        count: 0
      };
    }
    acc[hour].actual += entry.actualLogs || 0;
    acc[hour].target += entry.targetLogs;
    acc[hour].count += 1;
    return acc;
  }, {} as Record<number, { actual: number; target: number; count: number }>);

  // Calculate averages and prepare data for display
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const chartData = hours.map(hour => ({
    hour,
    actual: hourlyData[hour]?.actual / (hourlyData[hour]?.count || 1),
    target: hourlyData[hour]?.target / (hourlyData[hour]?.count || 1)
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Production Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          {/* Chart visualization would go here - we'll implement it in the next iteration */}
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Production trend visualization coming soon
          </div>
        </div>
      </CardContent>
    </Card>
  );
}