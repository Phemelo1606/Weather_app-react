import { LocateFixed } from 'lucide-react';
import Button from '../Button/Button';
import Logo from '../Logo/Logo';
import NavTabs, { type NavItem } from '../NavTabs/NavTabs';
import SearchBar from '../SearchBar/SearchBar';
import './Header.css';

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/saved', label: 'Saved' },
  { to: '/settings', label: 'Settings' },
];

interface HeaderProps {
  onSearch: (query: string) => void;
  onUseLocation: () => void;
  isLocating?: boolean;
}

export default function Header({ onSearch, onUseLocation, isLocating = false }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__inner">
        <Logo />
        <SearchBar className="header__search" onSearch={onSearch} />
        <Button className="header__locate" icon={<LocateFixed size={14} />} disabled={isLocating} onClick={onUseLocation}>
          {isLocating ? 'Locating…' : 'Use my location'}
        </Button>
        <div className="header__nav"><NavTabs items={NAV_ITEMS} /></div>
      </div>
    </header>
  );
}
