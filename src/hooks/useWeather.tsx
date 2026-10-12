import { useEffect, useState } from 'react';
import { fetchWeather } from '../api/mockWeatherApi';
import type { WeatherData } from '../types/weather';

const cacheKey = (locationId: string) => `nimbus:cache:${locationId}`;

export function useWeather(locationId: string) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    fetchWeather(locationId)
      .then((result) => {
        if (isCancelled) return;
        setData(result);
        setIsFromCache(false);
        try { localStorage.setItem(cacheKey(locationId), JSON.stringify(result)); } catch { /* ignore */ }
      })
      .catch(() => {
        if (isCancelled) return;
        const cached = localStorage.getItem(cacheKey(locationId));
        if (cached) {
          setData(JSON.parse(cached) as WeatherData);
          setIsFromCache(true);
        } else {
          setData(null);
          setError('We could not load the forecast. Check your connection and try again.');
        }
      })
      .finally(() => { if (!isCancelled) setIsLoading(false); });

    return () => { isCancelled = true; };
  }, [locationId]);

  return { data, isLoading, error, isFromCache };
}
