import { useState } from 'react';
import { useShifts } from '@/hooks/use-shifts';
import { ShiftWithProgress } from '@/types/shift';
import { ShiftForm } from './shift-form';
import { ShiftCard } from './shift-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Plus, Download } from 'lucide-react';
import { getFriendlyShiftName, isValidDateString } from '@/utils/format';
import { isAfter, isBefore, isWithinInterval } from 'date-fns';
import { Badge } from '@/components/ui/badge';

function isDateInRange(date: Date, startStr: string, endStr: string): boolean {
  if (!isValidDateString(startStr) || !isValidDateString(endStr)) {
    return false;
  }
  const start = new Date(startStr);
  const end = new Date(endStr);
  return isWithinInterval(date, { start, end });
}

export function ShiftsPage() {
  const { shifts, addShift, updateShift, deleteShift, addEntry } = useShifts();
  const [activeTab, setActiveTab] = useState('current');

  const now = new Date();

  const shiftsWithProgress: ShiftWithProgress[] = shifts
    .filter(shift => isValidDateString(shift.startDateTime) && isValidDateString(shift.endDateTime))
    .map(shift => {
      const actualLogs = (shift.entries || []).reduce((sum, entry) => sum + entry.actualLogs, 0);
      const efficiency = shift.targetLogs > 0 ? (actualLogs / shift.targetLogs) * 100 : 0;
      const isActive = isDateInRange(now, shift.startDateTime, shift.endDateTime);
      const friendlyName = getFriendlyShiftName(
        new Date(shift.startDateTime),
        new Date(shift.endDateTime)
      );

      return {
        ...shift,
        entries: shift.entries || [],
        actualLogs,
        efficiency,
        isActive,
        friendlyName,
      };
    });

  // Split shifts into current, upcoming, and historical
  const currentShifts = shiftsWithProgress
    .filter(shift => 
      isDateInRange(now, shift.startDateTime, shift.endDateTime)
    )
    .sort((a, b) => 
      new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
    );

  const upcomingShifts = shiftsWithProgress
    .filter(shift => isAfter(new Date(shift.startDateTime), now))
    .sort((a, b) => 
      new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
    );

  const historicalShifts = shiftsWithProgress
    .filter(shift => isBefore(new Date(shift.endDateTime), now))
    .sort((a, b) => 
      new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime()
    );

  // Calculate overall efficiency for active shifts
  const activeShiftsEfficiency = currentShifts.length > 0
    ? currentShifts.reduce((sum, shift) => sum + shift.efficiency, 0) / currentShifts.length
    : 0;

  const exportShifts = () => {
    const data = {
      shifts: shiftsWithProgress.map(shift => ({
        ...shift,
        efficiency: shift.efficiency.toFixed(1) + '%',
        startDateTime: new Date(shift.startDateTime).toLocaleString(),
        endDateTime: new Date(shift.endDateTime).toLocaleString(),
      }))
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shifts-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container max-w-6xl space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <CardTitle>Shift Management</CardTitle>
            {currentShifts.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant={activeShiftsEfficiency >= 90 ? "default" : "destructive"}>
                  Current Efficiency: {activeShiftsEfficiency.toFixed(1)}%
                </Badge>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportShifts}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <ShiftForm onSubmit={addShift}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Shift
              </Button>
            </ShiftForm>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="current" className="relative">
                Current
                {currentShifts.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {currentShifts.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                Upcoming
                {upcomingShifts.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {upcomingShifts.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="history">
                History
                {historicalShifts.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {historicalShifts.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="mt-4">
              {currentShifts.length === 0 ? (
                <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed">
                  <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                    <Clock className="h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No active shifts</h3>
                    <p className="mb-4 mt-2 text-sm text-muted-foreground">
                      There are no shifts currently in progress.
                    </p>
                    <ShiftForm onSubmit={addShift}>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Shift
                      </Button>
                    </ShiftForm>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6">
                  {currentShifts.map(shift => (
                    <ShiftCard
                      key={shift.id}
                      shift={shift}
                      onUpdate={updateShift}
                      onDelete={deleteShift}
                      onAddEntry={addEntry}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="mt-4">
              {upcomingShifts.length === 0 ? (
                <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed">
                  <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                    <Clock className="h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No upcoming shifts</h3>
                    <p className="mb-4 mt-2 text-sm text-muted-foreground">
                      Add future shifts to plan your production schedule.
                    </p>
                    <ShiftForm onSubmit={addShift}>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Shift
                      </Button>
                    </ShiftForm>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6">
                  {upcomingShifts.map(shift => (
                    <ShiftCard
                      key={shift.id}
                      shift={shift}
                      onUpdate={updateShift}
                      onDelete={deleteShift}
                      onAddEntry={addEntry}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <div className="grid gap-6">
                {historicalShifts.map(shift => (
                  <ShiftCard
                    key={shift.id}
                    shift={shift}
                    onUpdate={updateShift}
                    onDelete={deleteShift}
                    onAddEntry={addEntry}
                  />
                ))}
                {historicalShifts.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    No historical shifts found
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}