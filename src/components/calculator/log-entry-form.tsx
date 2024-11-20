import { useState } from 'react';
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

interface LogEntryFormProps {
  onSubmit: (actualLogs: number, notes?: string) => void;
  predictedLogs: number;
}

export function LogEntryForm({ onSubmit, predictedLogs }: LogEntryFormProps) {
  const [open, setOpen] = useState(false);
  const [actualLogs, setActualLogs] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(Number(actualLogs), notes);
    setOpen(false);
    setActualLogs('');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Save Results</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Actual Results</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Predicted Output</Label>
            <div className="text-sm text-muted-foreground">
              {predictedLogs.toFixed(2)} logs/min
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="actualLogs">Actual Logs Produced</Label>
            <Input
              id="actualLogs"
              type="number"
              value={actualLogs}
              onChange={(e) => setActualLogs(e.target.value)}
              required
              min="0"
              step="0.01"
              placeholder="Enter actual logs produced"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about the production run"
            />
          </div>
          <Button type="submit" className="w-full">Save Entry</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}