import { useNavigate } from 'react-router';
import Button from '../components/Button/Button';
import EmptyState from '../components/EmptyState/EmptyState';
import SavedLocationCard from '../components/SavedLocationCard/SavedLocationCard';
import Spinner from '../components/Spinner/Spinner';
import { useSettings } from '../context/SettingsContext';
import { useSavedLocations } from '../hooks/useSavedLocations';
import './SavedPage.css';

export default function Saved() {
  const navigate = useNavigate();
  const { units } = useSettings();
  const { saved, isLoading, toggleSaved } = useSavedLocations();

  return (
    <main className="page">
      <h1 className="page__title">Saved locations</h1>
      <p className="page__subtitle">Tap a place to see its full forecast.</p>
      {isLoading && <Spinner />}
      {!isLoading && saved.length === 0 && (
        <EmptyState title="Nothing saved yet" description="Tap the star on a location to keep it here."
          action={<Button variant="primary" onClick={() => navigate('/')}>Back to Home</Button>} />
      )}
      <div className="saved-grid">
        {saved.map((item) => (
          <SavedLocationCard key={item.id} saved={item} units={units}
            onOpen={(id) => navigate(`/?loc=${id}`)} onRemove={toggleSaved} />
        ))}
      </div>
    </main>
  );
}
