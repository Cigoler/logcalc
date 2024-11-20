import { useState } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { useLogHistory } from '@/hooks/use-log-history';
import { calculateLogs, calculateRequiredSpeed } from '@/utils/calculations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogEntryForm } from './log-entry-form';
import { LogHistoryTable } from './log-history-table';
import { ForecastDialog } from './forecast-dialog';

interface SpeedCalculatorProps {
  selectedDiameter: string;
  onDiameterChange: (value: string) => void;
}

export function SpeedCalculator({ selectedDiameter, onDiameterChange }: SpeedCalculatorProps) {
  const { settings } = useSettings();
  const { history, addEntry, deleteEntry } = useLogHistory();
  const [speed, setSpeed] = useState('450');
  const [targetLogs, setTargetLogs] = useState('10');

  const currentDiameter = settings.diameters.find(d => d.id === selectedDiameter);
  const constant = currentDiameter?.constant || 0;

  const calculatedLogs = currentDiameter ? calculateLogs(Number(speed), constant) : 0;
  const requiredSpeed = targetLogs ? calculateRequiredSpeed(Number(targetLogs), constant) : 0;

  const handleSaveResults = (actualLogs: number, notes?: string, isFromSpeed = true) => {
    if (currentDiameter) {
      addEntry({
        diameterId: currentDiameter.id,
        speed: isFromSpeed ? Number(speed) : requiredSpeed,
        targetLogs: isFromSpeed ? calculatedLogs : Number(targetLogs),
        actualLogs,
        notes,
      });
    }
  };

  const adjustTargetLogs = (amount: number) => {
    setTargetLogs((current) => 
      Math.max(0, Number(current) + amount).toString()
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Winder Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Material Diameter</Label>
            <Select value={selectedDiameter} onValueChange={onDiameterChange}>
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

          <div className="grid md:grid-cols-2 gap-6">
            {/* Speed-based calculation */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Speed (RPM)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={speed}
                    onChange={(e) => setSpeed(e.target.value)}
                    min="0"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setSpeed((current) => 
                      Math.max(0, Number(current) - 50).toString()
                    )}
                  >
                    -50
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSpeed((current) => 
                      (Number(current) + 50).toString()
                    )}
                  >
                    +50
                  </Button>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <div className="text-sm font-medium">Calculated Output</div>
                <div className="mt-1 text-2xl font-bold">
                  {calculatedLogs.toFixed(2)} logs/min
                </div>
                <div className="text-sm text-muted-foreground">
                  {(calculatedLogs * 60).toFixed(0)} logs/hr
                </div>
              </div>

              <div className="flex gap-2">
                <LogEntryForm
                  onSubmit={(logs, notes) => handleSaveResults(logs, notes, true)}
                  predictedLogs={calculatedLogs}
                />
                {currentDiameter && (
                  <ForecastDialog
                    speed={Number(speed)}
                    logsPerMinute={calculatedLogs}
                    diameter={currentDiameter.diameter}
                    constant={currentDiameter.constant}
                  />
                )}
              </div>
            </div>

            {/* Target-based calculation */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Target Logs per Minute</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={targetLogs}
                    onChange={(e) => setTargetLogs(e.target.value)}
                    min="0"
                    step="0.1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => adjustTargetLogs(-10)}
                  >
                    -10
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => adjustTargetLogs(10)}
                  >
                    +10
                  </Button>
                </div>
              </div>

              {targetLogs && (
                <div className="rounded-lg bg-muted p-4">
                  <div className="text-sm font-medium">Required Speed</div>
                  <div className="mt-1 text-2xl font-bold">
                    {requiredSpeed.toFixed(2)} RPM
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {(Number(targetLogs) * 60).toFixed(0)} logs/hr
                  </div>
                </div>
              )}

              {targetLogs && (
                <div className="flex gap-2">
                  <LogEntryForm
                    onSubmit={(logs, notes) => handleSaveResults(logs, notes, false)}
                    predictedLogs={Number(targetLogs)}
                  />
                  {currentDiameter && (
                    <ForecastDialog
                      speed={requiredSpeed}
                      logsPerMinute={Number(targetLogs)}
                      diameter={currentDiameter.diameter}
                      constant={currentDiameter.constant}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent History</CardTitle>
        </CardHeader>
        <CardContent>
          <LogHistoryTable 
            entries={history.entries.slice(0, 10)} 
            onDelete={deleteEntry}
          />
        </CardContent>
      </Card>
    </div>
  );
}