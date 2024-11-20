import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function DocumentationPage() {
  return (
    <div className="container max-w-4xl space-y-6">
      <Card>  
        <CardContent>
          <Tabs defaultValue="overview" className="mt-6 space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              <TabsTrigger value="shifts">Shift Management</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="prose dark:prose-invert">
              <h2>Welcome to LogCalc</h2>
              <p>
                LogCalc is a specialised tool designed for winder operators to optimise their production efficiency. 
                This documentation will help you understand how to use each feature effectively.
              </p>

              <h3>Key Features</h3>
              <ul>
                <li>Speed Calculator - Calculate optimal winder speeds and track production</li>
                <li>Shift Management - Plan and monitor production shifts</li>
                <li>Material Settings - Configure different material diameters</li>
                <li>Production Analytics - Track efficiency and performance</li>
              </ul>

              <h3>Getting Started</h3>
              <ol>
                <li>Configure your material diameters in the Settings page</li>
                <li>Use the Calculator to determine optimal speeds</li>
                <li>Set up shifts to track production over time</li>
                <li>Monitor performance through the dashboard</li>
              </ol>
            </TabsContent>

            <TabsContent value="calculator" className="prose dark:prose-invert">
              <h2>Speed Calculator</h2>
              <p>
                The calculator helps you determine optimal winder speeds and track production results.
              </p>

              <h3>Speed-based Calculation</h3>
              <ul>
                <li>Select your material diameter</li>
                <li>Enter the current speed in RPM</li>
                <li>View the calculated output in logs per minute</li>
                <li>Use +/- 50 buttons for quick speed adjustments</li>
                <li>Save actual results for tracking</li>
              </ul>

              <h3>Target-based Calculation</h3>
              <ul>
                <li>Enter your target logs per minute</li>
                <li>View the required speed to achieve the target</li>
                <li>Use +/- 10 buttons to adjust targets</li>
                <li>Track actual results against targets</li>
              </ul>

              <h3>Production Forecast</h3>
              <p>
                Use the forecast feature to:
              </p>
              <ul>
                <li>View expected production over 12 hours</li>
                <li>See projected completion times</li>
                <li>Plan production targets</li>
              </ul>

              <h3>Recent History</h3>
              <p>
                The history table shows:
              </p>
              <ul>
                <li>Date and time of production runs</li>
                <li>Material diameter used</li>
                <li>Speed settings</li>
                <li>Target vs actual production</li>
                <li>Efficiency variance</li>
                <li>Production notes</li>
              </ul>
            </TabsContent>

            <TabsContent value="shifts" className="prose dark:prose-invert">
              <h2>Shift Management</h2>
              <p>
                The shift management system helps you plan, track, and analyse production across different shifts.
              </p>

              <h3>Creating Shifts</h3>
              <ul>
                <li>Click "Add Shift" to create a new shift</li>
                <li>Set start date/time and duration</li>
                <li>Define target production</li>
                <li>Select default material diameter</li>
                <li>Add optional shift notes</li>
              </ul>

              <h3>Production Entries</h3>
              <p>
                During a shift, you can:
              </p>
              <ul>
                <li>Add multiple production entries</li>
                <li>Switch between different material diameters</li>
                <li>Record actual production numbers</li>
                <li>Track production duration</li>
                <li>Add notes for each entry</li>
              </ul>

              <h3>Shift Categories</h3>
              <ul>
                <li><strong>Current:</strong> Active shifts happening now</li>
                <li><strong>Upcoming:</strong> Future planned shifts</li>
                <li><strong>History:</strong> Completed shifts</li>
              </ul>

              <h3>Monitoring Progress</h3>
              <p>
                Each shift card shows:
              </p>
              <ul>
                <li>Overall progress and efficiency</li>
                <li>Production by material type</li>
                <li>Detailed entry logs</li>
                <li>Expected vs actual output</li>
                <li>Performance alerts</li>
              </ul>

              <h3>Data Export</h3>
              <p>
                Export shift data to JSON format for:
              </p>
              <ul>
                <li>Record keeping</li>
                <li>Analysis in other tools</li>
                <li>Reporting purposes</li>
              </ul>
            </TabsContent>

            <TabsContent value="settings" className="prose dark:prose-invert">
              <h2>Settings</h2>
              <p>
                Configure your material diameters and production constants.
              </p>

              <h3>Material Diameters</h3>
              <ul>
                <li>Add different material diameters</li>
                <li>Set production constants for each diameter</li>
                <li>Edit existing configurations</li>
                <li>Remove unused diameters</li>
              </ul>

              <h3>Production Constants</h3>
              <p>
                The production constant is used to calculate logs per minute:
              </p>
              <pre>Logs per minute = Speed × Constant</pre>
              <p>
                Ensure your constants are accurately set for precise calculations.
              </p>

              <h3>Default Settings</h3>
              <p>
                You can reset to default settings if needed:
              </p>
              <ul>
                <li>105mm (Constant: 0.04198)</li>
                <li>112mm (Constant: 0.04198)</li>
              </ul>

              <h3>Best Practices</h3>
              <ul>
                <li>Regularly verify your constants</li>
                <li>Remove unused material configurations</li>
                <li>Keep notes on any constant adjustments</li>
                <li>Backup your settings before major changes</li>
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}