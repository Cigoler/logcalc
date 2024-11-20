import { useState } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { Shift } from '@/types/shift';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { addHours, format } from 'date-fns';

interface ShiftFormProps {
  onSubmit: (shift: Omit<Shift, 'id'>) => void;
  initialValues?: Shift;
  children?: React.ReactNode;
}

export function ShiftForm({ onSubmit, initialValues, children }: ShiftFormProps) {
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);
  
  // Default to current date/time rounded to the next hour
  const defaultStart = new Date();
  defaultStart.setMinutes(0, 0, 0);
  defaultStart.setHours(defaultStart.getHours() + 1);
  
  const [startDateTime, setStartDateTime] = useState(
    initialValues?.startDateTime || defaultStart.toISOString().slice(0, 16)
  );
  const [duration, setDuration] = useState(
    initialValues 
      ? String((new Date(initialValues.endDateTime).getTime() - new Date(initialValues.startDateTime).getTime()) / (1000 * 60 * 60))
      : "8"
  );
  const [targetLogs, setTargetLogs] = useState(initialValues?.targetLogs?.toString() || '4000');
  const [diameterId, setDiameterId] = useState(initialValues?.diameterId || settings.diameters[0]?.id);
  const [notes, setNotes] = useState(initialValues?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(startDateTime);
    const end = addHours(start, Number(duration));
    
    onSubmit({
      startDateTime: start.toISOString(),
      endDateTime: end.toISOString(),
      targetLogs: Number(targetLogs),
      diameterId,
      notes,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant={initialValues ? 'outline' : 'default'}>
            {initialValues ? 'Edit Shift' : 'Add Shift'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialValues ? 'Edit Shift' : 'Add New Shift'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Start Date & Time</Label>
            <Input
              type="datetime-local"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Duration (hours)</Label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              min="1"
              max="24"
              step="0.5"
            />
          </div>

          <div className="space-y-2">
            <Label>Target Logs</Label>
            <Input
              type="number"
              value={targetLogs}
              onChange={(e) => setTargetLogs(e.target.value)}
              required
              min="0"
            />
          </div>

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
            <Label>Notes (Optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this shift"
            />
          </div>

          <Button type="submit" className="w-full">
            {initialValues ? 'Save Changes' : 'Add Shift'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}