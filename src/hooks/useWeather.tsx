import { useEffect, useState } from 'react';
import { fetchWeather } from '../api/weatherService';
import type { WeatherData } from '../types/weather';

const cacheKey = (locationId: string) => `nimbus:cache:${locationId}`;

export function useWeather(locationId: string | null) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const [settledLocationId, setSettledLocationId] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    if (!locationId) {
      return () => { isCancelled = true; };
    }

    fetchWeather(locationId)
      .then((result) => {
        if (isCancelled) return;
        setData(result);
        setIsFromCache(false);
        setError(null);
        try { localStorage.setItem(cacheKey(locationId), JSON.stringify(result)); } catch { /* ignore */ }
      })
      .catch((requestError: unknown) => {
        if (isCancelled) return;
        let cached: string | null = null;
        try {
          cached = localStorage.getItem(cacheKey(locationId));
        } catch {
          // Continue with the request error when browser storage is unavailable.
        }
        let cachedWeather: WeatherData | null = null;
        try {
          cachedWeather = cached ? JSON.parse(cached) as WeatherData : null;
        } catch {
          // Ignore malformed cached data and report the original request failure.
        }
        if (cachedWeather) {
          setData(cachedWeather);
          setIsFromCache(true);
          setError(null);
        } else {
          setData(null);
          setError(requestError instanceof Error
            ? requestError.message
            : 'We could not load the forecast. Check your connection and try again.');
        }
      })
      .finally(() => { if (!isCancelled) setSettledLocationId(locationId); });

    return () => { isCancelled = true; };
  }, [locationId]);

  return {
    data: locationId && data?.location.id === locationId ? data : null,
    isLoading: !locationId || settledLocationId !== locationId,
    error: settledLocationId === locationId ? error : null,
    isFromCache: Boolean(locationId && data?.location.id === locationId) && isFromCache,
  };
}
