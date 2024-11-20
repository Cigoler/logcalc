import { format, isToday, isTomorrow, isYesterday, isValid } from 'date-fns';

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  if (!isValid(date)) return 'Invalid date';
  
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatDuration(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours === 0) {
    return `${minutes}m`;
  }
  
  return `${hours}h ${minutes}m`;
}

export function getExpectedTime(hour: number): string {
  const time = new Date();
  time.setHours(time.getHours() + hour - 1);
  return time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getFriendlyShiftName(startDate: Date, endDate: Date): string {
  if (!isValid(startDate) || !isValid(endDate)) {
    return 'Invalid shift time';
  }

  const startFormat = isToday(startDate) ? 'h:mm a'
    : isTomorrow(startDate) ? "'Tomorrow at' h:mm a"
    : isYesterday(startDate) ? "'Yesterday at' h:mm a"
    : 'EEE, MMM d, h:mm a';

  const endFormat = isToday(endDate) ? 'h:mm a'
    : isTomorrow(endDate) ? "'tomorrow at' h:mm a"
    : isYesterday(endDate) ? "'yesterday at' h:mm a"
    : 'EEE, MMM d, h:mm a';

  return `${format(startDate, startFormat)} - ${format(endDate, endFormat)}`;
}

export function isValidDateString(dateStr: string): boolean {
  const date = new Date(dateStr);
  return isValid(date);
}