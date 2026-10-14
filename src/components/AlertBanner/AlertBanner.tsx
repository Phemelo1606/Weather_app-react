import { TriangleAlert, X } from 'lucide-react';
import Button from '../Button/Button';
import './AlertBanner.css';

interface AlertBannerProps {
  title: string;
  message: string;
  onDismiss: () => void;
}

export default function AlertBanner({ title, message, onDismiss }: AlertBannerProps) {
  return (
    <div className="alert-banner" role="alert">
      <TriangleAlert size={16} className="alert-banner__icon" aria-hidden="true" />
      <div className="alert-banner__text">
        <p className="alert-banner__title">{title}</p>
        <p className="alert-banner__message">{message}</p>
      </div>
      <Button variant="ghost" aria-label={`Dismiss ${title}`} icon={<X size={14} />} onClick={onDismiss} />
    </div>
  );
}
