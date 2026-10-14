import type { LocationInfo, SavedLocation } from '../types/weather';

// MockAPI resource `saved`: { id (auto), locationId, location }
const BASE_URL = import.meta.env.VITE_MOCKAPI_URL;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!BASE_URL) throw new Error('VITE_MOCKAPI_URL is not configured.');
  if (BASE_URL.endsWith('/')) {
    throw new Error('VITE_MOCKAPI_URL must not have a trailing slash.');
  }
  if (!path.startsWith('/') || path.startsWith('//')) {
    throw new Error(`API paths must start with exactly one slash: ${path}`);
  }
  const url = `${BASE_URL}${path}`;
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    });
  } catch (error) {
    throw new Error(`Network request failed for ${url}: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (!response.ok) throw new Error(`Request failed (${response.status}) for ${url}`);
  try {
    return await response.json() as T;
  } catch (error) {
    throw new Error(`Invalid JSON response (${response.status}) for ${url}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const getSavedLocations = () => request<SavedLocation[]>('/saved');

export async function addSavedLocation(location: LocationInfo): Promise<SavedLocation> {
  const existing = await request<SavedLocation[]>(`/saved?locationId=${encodeURIComponent(location.id)}`);
  const duplicate = existing.find((item) => item.locationId === location.id);
  if (duplicate) return duplicate;

  return request<SavedLocation>('/saved', {
    method: 'POST',
    body: JSON.stringify({ locationId: location.id, location }),
  });
}

export const deleteSavedLocation = (recordId: string) =>
  request<SavedLocation>(`/saved/${encodeURIComponent(recordId)}`, { method: 'DELETE' });
