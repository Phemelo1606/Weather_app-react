import type { ReactNode } from 'react';
import Card from '../Card/card';
import './DetailCard.css';

export interface DetailCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  caption?: string;
}

export default function DetailCard({ icon, label, value, caption }: DetailCardProps) {
  return (
    <Card as="article" className="detail-card">
      <p className="detail-card__label"><span aria-hidden="true">{icon}</span>{label}</p>
      <p className="detail-card__value">{value}</p>
      {caption && <p className="detail-card__caption">{caption}</p>}
    </Card>
  );
}
