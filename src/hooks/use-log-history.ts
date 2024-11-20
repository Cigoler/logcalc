import { useState, useEffect } from 'react';
import { LogEntry, LogHistory } from '@/types/log-entry';
import { loadFromLocalStorage, saveToLocalStorage } from '@/utils/storage';

const LOG_HISTORY_KEY = 'winder-log-history';

export function useLogHistory() {
  const [history, setHistory] = useState<LogHistory>({ entries: [] });

  useEffect(() => {
    const savedHistory = loadFromLocalStorage(LOG_HISTORY_KEY);
    if (savedHistory) {
      setHistory(savedHistory);
    }
  }, []);

  const addEntry = (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newEntry: LogEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    const newHistory = {
      entries: [newEntry, ...history.entries],
    };
    setHistory(newHistory);
    saveToLocalStorage(LOG_HISTORY_KEY, newHistory);
    return newEntry;
  };

  const updateEntry = (id: string, updates: Partial<LogEntry>) => {
    const newHistory = {
      entries: history.entries.map(entry =>
        entry.id === id ? { ...entry, ...updates } : entry
      ),
    };
    setHistory(newHistory);
    saveToLocalStorage(LOG_HISTORY_KEY, newHistory);
  };

  const deleteEntry = (id: string) => {
    const newHistory = {
      entries: history.entries.filter(entry => entry.id !== id),
    };
    setHistory(newHistory);
    saveToLocalStorage(LOG_HISTORY_KEY, newHistory);
  };

  return {
    history,
    addEntry,
    updateEntry,
    deleteEntry,
  };
}