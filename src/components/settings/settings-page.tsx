import { useSettings } from '@/hooks/use-settings';
import { DiameterForm } from './diameter-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

export function SettingsPage() {
  const { settings, addDiameter, updateDiameter, deleteDiameter, resetToDefaults } = useSettings();

  return (
    <div className="container p-6 max-w-4xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Material Diameters</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetToDefaults}>
              Reset to Defaults
            </Button>
            <DiameterForm onSubmit={addDiameter} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {settings.diameters.map((diameter) => (
              <div
                key={diameter.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="space-y-1">
                  <div className="text-lg font-medium">{diameter.diameter}mm</div>
                  <div className="text-sm text-muted-foreground">
                    Constant: {diameter.constant}
                  </div>
                </div>
                <div className="flex gap-2">
                  <DiameterForm
                    onSubmit={(newDiameter, newConstant) =>
                      updateDiameter(diameter.id, {
                        diameter: newDiameter,
                        constant: newConstant,
                      })
                    }
                    initialValues={diameter}
                    buttonText="Edit"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteDiameter(diameter.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}