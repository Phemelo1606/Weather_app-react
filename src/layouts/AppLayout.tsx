import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { findNearestLocation, searchLocations } from '../api/mockWeatherApi';
import  Header  from '../components/Header/Header';
import { useAppContext } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import './AppLayout.css';

export default function AppLayout() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { setActiveLocationId } = useAppContext();
  const [isLocating, setIsLocating] = useState(false);

  const handleSearch = async (query: string) => {
    const [match] = await searchLocations(query);
    if (!match) {
      showToast(`No match for "${query}". Check the spelling or try a nearby city.`, 'error');
      return;
    }
    setActiveLocationId(match.id);
    showToast(`Showing weather for ${match.name}.`, 'success');
    navigate('/');
  };

  const handleUseLocation = () => {
    if (!('geolocation' in navigator)) {
      showToast('This browser does not support location access. Search for a city instead.', 'error');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const place = await findNearestLocation(coords.latitude, coords.longitude);
        setActiveLocationId(place.id);
        setIsLocating(false);
        showToast(`Showing weather for ${place.name}.`, 'success');
        navigate('/');
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
