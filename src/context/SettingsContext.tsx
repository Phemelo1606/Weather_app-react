import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Theme, Units } from '../types/weather';

interface SettingsValue {
  theme: Theme; units: Units;
  setTheme: (theme: Theme) => void; setUnits: (units: Units) => void;
}
const KEY = 'nimbus:settings';
const SettingsContext = createContext<SettingsValue | null>(null);

function loadSettings(): { theme: Theme; units: Units } {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) ?? '{}') as Partial<SettingsValue>;
    return {
      theme: stored.theme === 'dark' ? 'dark' : 'light',
      units: stored.units === 'imperial' ? 'imperial' : 'metric',
    };
  } catch {
    return { theme: 'light', units: 'metric' };
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(settings));
    document.documentElement.dataset.theme = settings.theme;
  }, [settings]);

  const value: SettingsValue = {
    ...settings,
    setTheme: (theme) => setSettings((prev) => ({ ...prev, theme })),
    setUnits: (units) => setSettings((prev) => ({ ...prev, units })),
  };
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
