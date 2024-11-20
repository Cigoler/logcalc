export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-US', {
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