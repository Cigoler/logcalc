export interface Shift {
  id: string;
  startDateTime: string; // ISO string
  endDateTime: string;   // ISO string
  targetLogs: number;
  diameterId: string;
  notes?: string;
  entries: ShiftEntry[];
}

export interface ShiftEntry {
  id: string;
  timestamp: number;
  diameterId: string;
  speed: number;
  duration: number; // in minutes
  actualLogs: number;
  notes?: string;
}

export interface ShiftWithProgress extends Shift {
  actualLogs: number;
  efficiency: number;
  isActive: boolean;
  friendlyName: string;
}