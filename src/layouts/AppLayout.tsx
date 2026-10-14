import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { findNearestLocation, searchLocations } from '../api/weatherService';
import Header from '../components/Header/Header';
import { useToast } from '../context/ToastContext';
import './AppLayout.css';

export default function AppLayout() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLocating, setIsLocating] = useState(false);

  const handleSearch = async (query: string) => {
    try {
      const [match] = await searchLocations(query);
      if (!match) {
        showToast(`No match for "${query}". Check the spelling or try a nearby city.`, 'error');
        return;
      }
      showToast(`Showing weather for ${match.name}.`, 'success');
      navigate(`/?loc=${encodeURIComponent(match.id)}`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not search locations.', 'error');
    }
  };

  const handleUseLocation = () => {
    if (!('geolocation' in navigator)) {
      showToast('This browser does not support location access. Search for a city instead.', 'error');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const place = await findNearestLocation(coords.latitude, coords.longitude);
          showToast(`Showing weather for ${place.name}.`, 'success');
          navigate(`/?loc=${encodeURIComponent(place.id)}`);
        } catch (error) {
          showToast(error instanceof Error ? error.message : 'Could not find a nearby location.', 'error');
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        showToast('Location access was denied. Search for a city instead.', 'error');
      },
    );
  };

  return (
    <div className="app-layout">
      <Header onSearch={handleSearch} onUseLocation={handleUseLocation} isLocating={isLocating} />
      <main className="app-layout__main"><Outlet /></main>
    </div>
  );
}
