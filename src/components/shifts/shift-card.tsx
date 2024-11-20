import { useSettings } from '@/hooks/use-settings';
import { ShiftWithProgress } from '@/types/shift';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShiftForm } from './shift-form';
import { ShiftEntryForm } from './shift-entry-form';
import { Trash2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface ShiftCardProps {
  shift: ShiftWithProgress;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
  onAddEntry: (shiftId: string, entry: {
    diameterId: string;
    speed: number;
    duration: number;
    actualLogs: number;
    notes?: string;
    timestamp: number;
  }) => void;
}

export function ShiftCard({ shift, onUpdate, onDelete, onAddEntry }: ShiftCardProps) {
  const { settings } = useSettings();

  // Group entries by diameter for better visualization
  const entriesByDiameter = shift.entries.reduce((acc, entry) => {
    if (!acc[entry.diameterId]) {
      acc[entry.diameterId] = [];
    }
    acc[entry.diameterId].push(entry);
    return acc;
  }, {} as Record<string, typeof shift.entries>);

  // Calculate totals for each diameter
  const diameterTotals = Object.entries(entriesByDiameter).map(([diameterId, entries]) => {
    const diameter = settings.diameters.find(d => d.id === diameterId);
    const totalLogs = entries.reduce((sum, entry) => sum + entry.actualLogs, 0);
    const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);
    return {
      diameterId,
      diameter: diameter?.diameter || 'Unknown',
      totalLogs,
      totalDuration,
      entries: entries.sort((a, b) => b.timestamp - a.timestamp) // Most recent first
    };
  });

  return (
    <Card className={cn(
      "transition-colors",
      shift.isActive && "ring-2 ring-primary"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {shift.friendlyName}
          {shift.isActive && (
            <span className="ml-2 inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              Active
            </span>
          )}
        </CardTitle>
        <div className="flex gap-2">
          <ShiftForm
            onSubmit={(updates) => onUpdate(shift.id, updates)}
            initialValues={shift}
          />
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(shift.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Shift Time</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(shift.startDateTime), 'h:mm a')} - {format(new Date(shift.endDateTime), 'h:mm a')}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span className="font-medium">
                {shift.actualLogs} / {shift.targetLogs} logs
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  shift.efficiency >= 100
                    ? "bg-green-500"
                    : shift.efficiency >= 90
                    ? "bg-yellow-500"
                    : "bg-red-500"
                )}
                style={{ width: `${Math.min(100, shift.efficiency)}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {shift.efficiency.toFixed(1)}% efficiency
            </p>
          </div>

          <ShiftEntryForm
            shiftId={shift.id}
            defaultDiameterId={shift.diameterId}
            onSubmit={onAddEntry}
          />

          {/* Production by Material */}
          {diameterTotals.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Production by Material</p>
                <div className="flex gap-1">
                  {diameterTotals.map(({ diameterId, diameter, totalLogs }) => (
                    <Badge key={diameterId} variant="secondary">
                      {diameter}mm: {totalLogs}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Detailed entries grouped by diameter */}
              {diameterTotals.map(({ diameterId, diameter, entries }) => (
                <div key={diameterId} className="rounded-md border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{diameter}mm</p>
                    <Badge variant="outline">
                      {entries.reduce((sum, e) => sum + e.actualLogs, 0)} logs
                    </Badge>
                  </div>
                  <div className="divide-y">
                    {entries.map((entry) => {
                      const entryDiameter = settings.diameters.find(d => d.id === entry.diameterId);
                      const expectedLogs = entryDiameter 
                        ? Math.round(entry.speed * entryDiameter.constant * entry.duration)
                        : 0;

                      return (
                        <div key={entry.id} className="py-2 text-sm">
                          <div className="flex justify-between font-medium">
                            <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                            <span>
                              {entry.actualLogs} logs
                              <span className="ml-1 text-muted-foreground">
                                (exp. {expectedLogs} in {entry.duration}m)
                              </span>
                            </span>
                          </div>
                          <div className="text-muted-foreground">
                            {entry.duration} mins at {entry.speed} RPM
                          </div>
                          {entry.notes && (
                            <div className="mt-1 text-muted-foreground">
                              Note: {entry.notes}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {shift.isActive && shift.efficiency < 90 && (
            <div className="rounded-md bg-red-50 p-3">
              <div className="flex items-center gap-2 text-sm text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span>
                  Production is below target. Consider increasing speed to meet shift goals.
                </span>
              </div>
            </div>
          )}

          {shift.notes && (
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm">{shift.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}