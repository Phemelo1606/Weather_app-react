import { NavLink } from 'react-router';
import './NavTabs.css';

export interface NavItem {
  to: string;
  label: string;
}

interface NavTabsProps {
  items: NavItem[];
}

export default function NavTabs({ items }: NavTabsProps) {
  return (
    <nav className="nav-tabs" aria-label="Main">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => `nav-tabs__link${isActive ? ' nav-tabs__link--active' : ''}`}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
