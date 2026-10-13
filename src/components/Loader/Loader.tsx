import './Loader.css';

interface LoaderProps {
  label?: string;
}

export default function Loader({ label = 'Loading…' }: LoaderProps) {
  return (
    <div className="loader" role="status">
      <span className="loader__spinner" aria-hidden="true" />
      <p className="loader__label">{label}</p>
    </div>
  );
}
