import type { ReactNode } from 'react';
import './SettingRow.css';

interface SettingRowProps {
  label: string;
  description?: string;
  children: ReactNode;
}

export default function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="setting-row">
      <div className="setting-row__text">
        <p className="setting-row__label">{label}</p>
        {description && <p className="setting-row__description">{description}</p>}
      </div>
      <div className="setting-row__control">{children}</div>
    </div>
  );
}
