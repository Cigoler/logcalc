import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogEntry } from '@/types/log-entry';
import { useSettings } from '@/hooks/use-settings';
import { format } from 'date-fns';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface ProductionChartProps {
  entries: LogEntry[];
}

export function ProductionChart({ entries }: ProductionChartProps) {
  const { settings } = useSettings();

  const chartData = useMemo(() => {
    // Group entries by date
    const groupedByDate = entries.reduce((acc, entry) => {
      const date = format(entry.timestamp, 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = {
          date,
          actual: 0,
          target: 0,
          entries: [],
        };
      }
      acc[date].actual += entry.actualLogs || 0;
      acc[date].target += entry.targetLogs;
      acc[date].entries.push(entry);
      return acc;
    }, {} as Record<string, { date: string; actual: number; target: number; entries: LogEntry[] }>);

    // Convert to array and sort by date
    return Object.values(groupedByDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-14) // Last 14 days
      .map(day => ({
        ...day,
        date: format(new Date(day.date), 'MMM d'),
        efficiency: ((day.actual / day.target) * 100).toFixed(1) + '%',
      }));
  }, [entries]);

  // Calculate overall statistics
  const stats = useMemo(() => {
    const total = entries.reduce(
      (acc, entry) => {
        acc.actual += entry.actualLogs || 0;
        acc.target += entry.targetLogs;
        return acc;
      },
      { actual: 0, target: 0 }
    );

    return {
      efficiency: total.target ? (total.actual / total.target) * 100 : 0,
      totalProduction: total.actual,
      averageEfficiency:
        chartData.reduce((sum, day) => sum + parseFloat(day.efficiency), 0) /
        (chartData.length || 1),
    };
  }, [entries, chartData]);

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Production Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No production data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Production Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-muted px-3 py-2">
            <div className="text-sm font-medium text-muted-foreground">
              Total Production
            </div>
            <div className="text-2xl font-bold">
              {Math.round(stats.totalProduction).toLocaleString()}
            </div>
          </div>
          <div className="rounded-lg bg-muted px-3 py-2">
            <div className="text-sm font-medium text-muted-foreground">
              Overall Efficiency
            </div>
            <div className="text-2xl font-bold">
              {stats.efficiency.toFixed(1)}%
            </div>
          </div>
          <div className="rounded-lg bg-muted px-3 py-2">
            <div className="text-sm font-medium text-muted-foreground">
              Avg. Daily Efficiency
            </div>
            <div className="text-2xl font-bold">
              {stats.averageEfficiency.toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="mt-6 h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="actual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="target" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Actual
                          </span>
                          <span className="font-bold text-chart-1">
                            {payload[0].value?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Target
                          </span>
                          <span className="font-bold text-chart-2">
                            {payload[1].value?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-[0.70rem] text-muted-foreground">
                        Efficiency: {payload[0].payload.efficiency}
                      </div>
                    </div>
                  );
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="actual"
                name="Actual"
                stroke="hsl(var(--chart-1))"
                fill="url(#actual)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="target"
                name="Target"
                stroke="hsl(var(--chart-2))"
                fill="url(#target)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}