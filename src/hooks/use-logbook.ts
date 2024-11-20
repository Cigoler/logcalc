import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LogbookEntry, LogbookImage } from '@/types/logbook';

interface LogbookState {
  entries: LogbookEntry[];
  addEntry: (entry: Omit<LogbookEntry, 'id' | 'timestamp'>) => void;
  updateEntry: (id: string, updates: Partial<LogbookEntry>) => void;
  deleteEntry: (id: string) => void;
  addImage: (entryId: string, image: Omit<LogbookImage, 'id' | 'timestamp'>) => void;
  deleteImage: (entryId: string, imageId: string) => void;
}

export const useLogbook = create<LogbookState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) =>
        set((state) => ({
          entries: [
            {
              ...entry,
              id: crypto.randomUUID(),
              timestamp: Date.now(),
              images: [], // Initialize images array
            },
            ...state.entries,
          ],
        })),
      updateEntry: (id, updates) =>
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry
          ),
        })),
      deleteEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        })),
      addImage: (entryId, image) =>
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === entryId
              ? {
                  ...entry,
                  images: [
                    ...(entry.images || []), // Handle potentially undefined images array
                    {
                      ...image,
                      id: crypto.randomUUID(),
                      timestamp: Date.now(),
                    },
                  ],
                }
              : entry
          ),
        })),
      deleteImage: (entryId, imageId) =>
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === entryId
              ? {
                  ...entry,
                  images: (entry.images || []).filter((img) => img.id !== imageId),
                }
              : entry
          ),
        })),
    }),
    {
      name: 'logbook-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      onRehydrateStorage: () => (state) => {
        // Ensure all entries have an images array after loading from storage
        if (state) {
          state.entries = state.entries.map(entry => ({
            ...entry,
            images: entry.images || []
          }));
        }
      }
    }
  )
);