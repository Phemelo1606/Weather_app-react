import { useCallback, useEffect, useState } from 'react';
import { addSavedLocation, deleteSavedLocation, getSavedLocations } from '../api/savedApi';
import { useToast } from '../context/ToastContext';
import type { LocationInfo, SavedLocation } from '../types/weather';

export function useSavedLocations() {
  const { showToast } = useToast();
  const [saved, setSaved] = useState<SavedLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSavedLocations()
      .then(setSaved)
      .catch((error: unknown) => showToast(
        error instanceof Error ? error.message : 'Could not load saved locations.',
        'error',
      ))
      .finally(() => setIsLoading(false));
  }, [showToast]);

  const toggleSaved = useCallback(async (location: LocationInfo) => {
    const existing = saved.find((item) => item.locationId === location.id);
    try {
      if (existing) {
        await deleteSavedLocation(existing.id);
        setSaved((prev) => prev.filter((item) => item.id !== existing.id));
        showToast(`${location.name} removed from saved`, 'info');
      } else {
        const created = await addSavedLocation(location);
        setSaved((prev) => prev.some((item) => item.locationId === location.id)
          ? prev
          : [...prev, created]);
        showToast(`${location.name} saved`, 'success');
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        'error',
      );
    }
  }, [saved, showToast]);

  return {
    saved, isLoading, toggleSaved,
    isSaved: (id: string) => saved.some((item) => item.locationId === id),
  };
}
