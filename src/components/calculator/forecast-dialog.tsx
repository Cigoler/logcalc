import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarChart, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ForecastDialogProps {
  speed: number;
  logsPerMinute: number;
  diameter: number;
  constant: number;
}

export function ForecastDialog({ speed, logsPerMinute, diameter, constant }: ForecastDialogProps) {
  // Calculate forecast for 12 hours
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const logsPerHour = logsPerMinute * 60;
  
  const forecast = hours.map(hour => ({
    hour,
    target: Math.round(logsPerHour * hour),
    cumulative: Math.round(logsPerHour * hour),
  }));

  const totalLogs = forecast[forecast.length - 1].cumulative;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BarChart className="h-4 w-4" />
          View Forecast
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>12-Hour Production Forecast</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Settings Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg bg-muted p-3">
              <div className="text-sm font-medium text-muted-foreground">Diameter</div>
              <div className="text-lg font-bold">{diameter}mm</div>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <div className="text-sm font-medium text-muted-foreground">Speed</div>
              <div className="text-lg font-bold">{speed} RPM</div>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <div className="text-sm font-medium text-muted-foreground">Output</div>
              <div className="text-lg font-bold">{logsPerMinute.toFixed(2)}/min</div>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <div className="text-sm font-medium text-muted-foreground">Total (12h)</div>
              <div className="text-lg font-bold">{totalLogs.toLocaleString()}</div>
            </div>
          </div>

          {/* Hourly Forecast Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hour</TableHead>
                  <TableHead>Target Production</TableHead>
                  <TableHead>Cumulative</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forecast.map((row) => {
                  const time = new Date();
                  time.setHours(time.getHours() + row.hour);
                  
                  return (
                    <TableRow key={row.hour}>
                      <TableCell>Hour {row.hour}</TableCell>
                      <TableCell>{row.target.toLocaleString()}</TableCell>
                      <TableCell>{row.cumulative.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {time.toLocaleTimeString('en-US', { 
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Production Notes */}
          <div className="rounded-lg border p-4 text-sm space-y-2">
            <h4 className="font-medium">Production Notes</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Forecast assumes consistent production speed</li>
              <li>No downtime or breaks factored into calculations</li>
              <li>Times shown are based on current time + hours</li>
              <li>Actual production may vary based on conditions</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}