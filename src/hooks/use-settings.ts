import { useState, useEffect } from 'react';
import { Settings, DEFAULT_SETTINGS, DiameterSetting } from '@/types/settings';
import { loadFromLocalStorage, saveToLocalStorage } from '@/utils/storage';

const SETTINGS_KEY = 'winder-settings';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const savedSettings = loadFromLocalStorage(SETTINGS_KEY);
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  const saveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    saveToLocalStorage(SETTINGS_KEY, newSettings);
  };

  const addDiameter = (diameter: number, constant: number) => {
    const newDiameter: DiameterSetting = {
      id: Date.now().toString(),
      diameter,
      constant
    };
    const newSettings = {
      ...settings,
      diameters: [...settings.diameters, newDiameter]
    };
    saveSettings(newSettings);
  };

  const updateDiameter = (id: string, updates: Partial<DiameterSetting>) => {
    const newSettings = {
      ...settings,
      diameters: settings.diameters.map(d => 
        d.id === id ? { ...d, ...updates } : d
      )
    };
    saveSettings(newSettings);
  };

  const deleteDiameter = (id: string) => {
    const newSettings = {
      ...settings,
      diameters: settings.diameters.filter(d => d.id !== id)
    };
    saveSettings(newSettings);
  };

  const resetToDefaults = () => {
    saveSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    addDiameter,
    updateDiameter,
    deleteDiameter,
    resetToDefaults
  };
}