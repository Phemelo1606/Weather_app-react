import { CloudSun } from 'lucide-react';
import { Link } from 'react-router';
import './Logo.css';

export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Nimbus home">
      <span className="logo__mark"><CloudSun size={18} aria-hidden="true" /></span>
      <span className="logo__name">Nimbus</span>
    </Link>
  );
}
