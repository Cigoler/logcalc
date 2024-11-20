import { useState } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface ShiftEntryFormProps {
  shiftId: string;
  defaultDiameterId: string;
  onSubmit: (shiftId: string, entry: {
    diameterId: string;
    speed: number;
    duration: number;
    actualLogs: number;
    notes?: string;
    timestamp: number;
  }) => void;
}

export function ShiftEntryForm({ shiftId, defaultDiameterId, onSubmit }: ShiftEntryFormProps) {
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);
  const [diameterId, setDiameterId] = useState(defaultDiameterId);
  const [speed, setSpeed] = useState('450');
  const [duration, setDuration] = useState('60'); // Default to 60 minutes
  const [actualLogs, setActualLogs] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(shiftId, {
      diameterId,
      speed: Number(speed),
      duration: Number(duration),
      actualLogs: Number(actualLogs),
      notes: notes.trim() || undefined,
      timestamp: Date.now(),
    });
    setOpen(false);
    setActualLogs('');
    setDuration('60');
    setNotes('');
  };

  const currentDiameter = settings.diameters.find(d => d.id === diameterId);
  const estimatedLogs = currentDiameter 
    ? Math.round(Number(speed) * currentDiameter.constant * Number(duration))
    : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Production Entry
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Production Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Material Diameter</Label>
            <Select value={diameterId} onValueChange={setDiameterId}>
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

          <div className="space-y-2">
            <Label>Speed (RPM)</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                min="0"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setSpeed((current) => 
                  Math.max(0, Number(current) - 50).toString()
                )}
              >
                -50
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSpeed((current) => 
                  (Number(current) + 50).toString()
                )}
              >
                +50
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Duration (minutes)</Label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="1"
              max="480"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Actual Logs Produced</Label>
            <Input
              type="number"
              value={actualLogs}
              onChange={(e) => setActualLogs(e.target.value)}
              min="0"
              required
            />
            {estimatedLogs > 0 && (
              <p className="text-sm text-muted-foreground">
                Expected output for {duration} minutes at this speed: ~{estimatedLogs} logs
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this production run"
            />
          </div>

          <Button type="submit" className="w-full">
            Save Entry
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}