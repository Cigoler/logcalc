export interface LogbookEntry {
  id: string;
  timestamp: number;
  title: string;
  content: string;
  category: 'maintenance' | 'issue' | 'solution' | 'observation' | 'other';
  tags: string[];
  images: LogbookImage[];
  diameterId?: string;
  speed?: number;
}

export interface LogbookImage {
  id: string;
  url: string;
  type: 'upload' | 'camera';
  timestamp: number;
}