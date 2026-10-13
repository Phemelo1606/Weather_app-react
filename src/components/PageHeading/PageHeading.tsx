import './PageHeading.css';

interface PageHeadingProps {
  title: string;
  subtitle?: string;
}

export default function PageHeading({ title, subtitle }: PageHeadingProps) {
  return (
    <div className="page-heading">
      <h1 className="page-heading__title">{title}</h1>
      {subtitle && <p className="page-heading__subtitle">{subtitle}</p>}
    </div>
  );
}
