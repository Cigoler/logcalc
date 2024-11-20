import { useSettings } from '@/hooks/use-settings';
import { LogEntry } from '@/types/log-entry';
// import { formatDate } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface LogHistoryTableProps {
  entries: LogEntry[];
  onDelete: (id: string) => void;
}

export function LogHistoryTable({ entries, onDelete }: LogHistoryTableProps) {
  const { settings } = useSettings();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Diameter</TableHead>
            <TableHead>Speed</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Actual</TableHead>
            <TableHead>Variance</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => {
            const diameter = settings.diameters.find(d => d.id === entry.diameterId);
            const variance = entry.actualLogs !== null 
              ? ((entry.actualLogs - entry.targetLogs) / entry.targetLogs * 100).toFixed(1)
              : null;
            
            return (
              <TableRow key={entry.id}>
                <TableCell>{formatDate(entry.timestamp)}</TableCell>
                <TableCell>{diameter?.diameter}mm</TableCell>
                <TableCell>{entry.speed} RPM</TableCell>
                <TableCell>{entry.targetLogs.toFixed(2)}</TableCell>
                <TableCell>{entry.actualLogs?.toFixed(2) || '-'}</TableCell>
                <TableCell>
                  {variance && (
                    <span className={variance.startsWith('-') ? 'text-red-500' : 'text-green-500'}>
                      {variance}%
                    </span>
                  )}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {entry.notes || '-'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(entry.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}