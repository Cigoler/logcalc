export interface LogEntry {
  id: string;
  timestamp: number;
  diameterId: string;
  speed: number;
  targetLogs: number;
  actualLogs: number | null;
  notes?: string;
}

export interface LogHistory {
  entries: LogEntry[];
}