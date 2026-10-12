import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { LocationInfo, Theme, Units } from '../types/weather';

interface AppContextValue {
  units: Units;
  setUnits: (units: Units) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  activeLocationId: string;
  setActiveLocationId: (id: string) => void;
  savedLocations: LocationInfo[];
  isSaved: (id: string) => boolean;
  toggleSaved: (location: LocationInfo) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [units, setUnits] = useLocalStorage<Units>('nimbus:units', 'metric');
  const [theme, setTheme] = useLocalStorage<Theme>('nimbus:theme', 'system');
  const [activeLocationId, setActiveLocationId] = useLocalStorage('nimbus:active', 'kimberley');
  const [savedLocations, setSavedLocations] = useLocalStorage<LocationInfo[]>('nimbus:saved', []);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const isDark = theme === 'dark' || (theme === 'system' && media.matches);
      root.dataset.theme = isDark ? 'dark' : 'light';
    };
    apply();
    if (theme !== 'system') return;
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [theme]);

  const isSaved = useCallback(
    (id: string) => savedLocations.some((location) => location.id === id),
    [savedLocations],
  );

  /** Returns true when the location was added, false when it was removed. */
  const toggleSaved = useCallback((location: LocationInfo) => {
    const alreadySaved = savedLocations.some((item) => item.id === location.id);
    setSavedLocations(
      alreadySaved ? savedLocations.filter((item) => item.id !== location.id) : [...savedLocations, location],
    );
    return !alreadySaved;
  }, [savedLocations, setSavedLocations]);

  const value = useMemo(
    () => ({ units, setUnits, theme, setTheme, activeLocationId, setActiveLocationId, savedLocations, isSaved, toggleSaved }),
    [units, setUnits, theme, setTheme, activeLocationId, setActiveLocationId, savedLocations, isSaved, toggleSaved],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used inside <AppProvider>');
  return context;
}
