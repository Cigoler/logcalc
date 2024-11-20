import { useState, useEffect } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { calculateRequiredSpeed } from '@/utils/calculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogRow {
  hour: number;
  target: number;
  actual: number | null;
  variance: number;
  requiredSpeed: number | null;
  notes: string;
}

const DEFAULT_TARGET = 526;

export function LogTracker() {
  const { settings } = useSettings();
  const [selectedDiameter, setSelectedDiameter] = useState(settings.diameters[0]?.id || '');
  const [rows, setRows] = useState<LogRow[]>(
    Array.from({ length: 12 }, (_, i) => ({
      hour: i + 1,
      target: DEFAULT_TARGET,
      actual: null,
      variance: -DEFAULT_TARGET,
      requiredSpeed: null,
      notes: '',
    }))
  );

  const currentDiameter = settings.diameters.find(d => d.id === selectedDiameter);

  useEffect(() => {
    calculateRequiredSpeeds();
  }, [selectedDiameter, rows]);

  const calculateRequiredSpeeds = () => {
    if (!currentDiameter) return;

    const lastEnteredIndex = rows.reduce((lastIndex, row, index) => 
      row.actual !== null ? index : lastIndex, -1);

    if (lastEnteredIndex === -1) return;

    const newRows = rows.map((row, index) => {
      if (index <= lastEnteredIndex) return row;

      const remainingHours = 12 - index;
      const actualSoFar = rows.slice(0, index)
        .reduce((sum, r) => sum + (r.actual || 0), 0);
      const targetSoFar = rows.slice(0, index)
        .reduce((sum, r) => sum + r.target, 0);
      const deficit = Math.max(0, targetSoFar - actualSoFar);
      
      const deficitPerHour = deficit / remainingHours;
      const targetPerMinute = (row.target + deficitPerHour) / 60;
      const requiredSpeed = calculateRequiredSpeed(targetPerMinute, currentDiameter.constant);

      return {
        ...row,
        requiredSpeed: row.actual === null ? requiredSpeed : null,
      };
    });

    setRows(newRows);
  };

  const handleTargetChange = (hour: number, value: string) => {
    const target = Number(value);
    if (isNaN(target)) return;

    setRows(prev => prev.map(row => {
      if (row.hour === hour) {
        const variance = (row.actual || 0) - target;
        return { ...row, target, variance };
      }
      return row;
    }));
  };

  const handleActualChange = (hour: number, value: string) => {
    const actual = value === '' ? null : Number(value);
    if (actual !== null && isNaN(actual)) return;

    setRows(prev => prev.map(row => {
      if (row.hour === hour) {
        const variance = (actual || 0) - row.target;
        return { ...row, actual, variance };
      }
      return row;
    }));
  };

  const handleNotesChange = (hour: number, notes: string) => {
    setRows(prev => prev.map(row =>
      row.hour === hour ? { ...row, notes } : row
    ));
  };

  const totalTarget = rows.reduce((sum, row) => sum + row.target, 0);
  const totalActual = rows.reduce((sum, row) => sum + (row.actual ?? 0), 0);
  const totalVariance = totalActual - totalTarget;

  const currentHour = Math.min(
    Math.floor((Date.now() - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60)),
    11
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Log Tracking</CardTitle>
        <div className="w-[200px]">
          <Label>Material Diameter</Label>
          <Select value={selectedDiameter} onValueChange={setSelectedDiameter}>
            <SelectTrigger>
              <SelectValue placeholder="Select diameter" />
            </SelectTrigger>
            <SelectContent>
              {settings.diameters.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.diameter}mm (Constant: {d.constant})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="rounded-md border">
            <div className="grid grid-cols-6 gap-4 p-4 font-medium border-b">
              <div>Hour</div>
              <div>Target</div>
              <div>Actual</div>
              <div>Variance</div>
              <div>Required Speed</div>
              <div>Notes</div>
            </div>
            <div className="divide-y">
              {rows.map((row) => (
                <div key={row.hour} className={cn(
                  "grid grid-cols-6 gap-4 p-4",
                  row.hour === currentHour + 1 && "bg-muted/50"
                )}>
                  <div>Hour {row.hour}</div>
                  <div>
                    <Input
                      type="number"
                      value={row.target}
                      onChange={(e) => handleTargetChange(row.hour, e.target.value)}
                      min="0"
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      value={row.actual?.toString() ?? ''}
                      onChange={(e) => handleActualChange(row.hour, e.target.value)}
                      placeholder="Enter actual"
                    />
                  </div>
                  <div className={cn(
                    "font-medium self-center",
                    row.variance > 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {row.variance}
                  </div>
                  <div className="self-center font-medium">
                    {row.requiredSpeed ? (
                      <div className="space-y-1">
                        <div>{Math.round(row.requiredSpeed)} RPM</div>
                        {currentDiameter && (
                          <div className="text-sm text-muted-foreground">
                            {Math.round(row.requiredSpeed * currentDiameter.constant * 60)} logs/hr
                          </div>
                        )}
                      </div>
                    ) : '-'}
                  </div>
                  <div>
                    <Input
                      value={row.notes}
                      onChange={(e) => handleNotesChange(row.hour, e.target.value)}
                      placeholder="Add note"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-sm font-medium">Total Target</div>
                <div className="text-2xl font-bold">{totalTarget}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Total Actual</div>
                <div className="text-2xl font-bold">{totalActual}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Total Variance</div>
                <div className={cn(
                  "text-2xl font-bold",
                  totalVariance > 0 ? "text-green-600" : "text-red-600"
                )}>
                  {totalVariance}
                </div>
              </div>
            </div>
          </div>

          {totalVariance < 0 && currentDiameter && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <span className="font-medium">Behind Target: </span>
                  <span>Currently {Math.abs(totalVariance)} logs below target production. </span>
                  <span>
                    Overall catch-up speed required: {Math.round(calculateRequiredSpeed(
                      (totalTarget / (12 * 60)), currentDiameter.constant
                    ))} RPM
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}