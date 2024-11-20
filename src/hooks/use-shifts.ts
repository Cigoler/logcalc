import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Shift, ShiftEntry } from '@/types/shift';

interface ShiftState {
  shifts: Shift[];
  addShift: (shift: Omit<Shift, 'id' | 'entries'>) => void;
  updateShift: (id: string, updates: Partial<Shift>) => void;
  deleteShift: (id: string) => void;
  addEntry: (shiftId: string, entry: Omit<ShiftEntry, 'id'>) => void;
}

export const useShifts = create<ShiftState>()(
  persist(
    (set) => ({
      shifts: [],
      addShift: (shift) =>
        set((state) => ({
          shifts: [...state.shifts, { 
            ...shift, 
            id: crypto.randomUUID(),
            entries: [] // Ensure entries is always initialized
          }],
        })),
      updateShift: (id, updates) =>
        set((state) => ({
          shifts: state.shifts.map((shift) =>
            shift.id === id ? { 
              ...shift, 
              ...updates,
              entries: shift.entries || [] // Ensure entries exists when updating
            } : shift
          ),
        })),
      deleteShift: (id) =>
        set((state) => ({
          shifts: state.shifts.filter((shift) => shift.id !== id),
        })),
      addEntry: (shiftId, entry) =>
        set((state) => ({
          shifts: state.shifts.map((shift) =>
            shift.id === shiftId
              ? {
                  ...shift,
                  entries: [...(shift.entries || []), { ...entry, id: crypto.randomUUID() }],
                }
              : shift
          ),
        })),
    }),
    {
      name: 'shifts-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      onRehydrateStorage: () => (state) => {
        // Ensure entries array exists for all shifts after loading from storage
        if (state) {
          state.shifts = state.shifts.map(shift => ({
            ...shift,
            entries: shift.entries || []
          }));
        }
      }
    }
  )
);