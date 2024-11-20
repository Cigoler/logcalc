import { useState } from 'react';
import { useSettings } from '@/hooks/use-settings';
// import { useLogHistory } from '@/hooks/use-log-history';
// import { calculateLogs, calculateRequiredSpeed } from '@/utils/calculations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SpeedCalculator } from './speed-calculator';
import { LogTracker } from './log-tracker';

export function Calculator() {
  const { settings } = useSettings();
  // const { history, addEntry } = useLogHistory();
  const [selectedDiameter, setSelectedDiameter] = useState(settings.diameters[0]?.id || '');

  return (
    <div className="container max-w-6xl space-y-6">
      <Tabs defaultValue="calculator" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calculator">Speed Calculator</TabsTrigger>
          <TabsTrigger value="tracking">Actual Logs Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <SpeedCalculator
            selectedDiameter={selectedDiameter}
            onDiameterChange={setSelectedDiameter}
          />
        </TabsContent>

        <TabsContent value="tracking">
          <LogTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
}