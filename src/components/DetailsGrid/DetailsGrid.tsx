import DetailCard, { type DetailCardProps } from '../DetailCard/DetailCard';
import './DetailsGrid.css';

interface DetailsGridProps {
  items: DetailCardProps[];
}

export default function DetailsGrid({ items }: DetailsGridProps) {
  return (
    <div className="details-grid">
      {items.map((item) => <DetailCard key={item.label} {...item} />)}
    </div>
  );
}
