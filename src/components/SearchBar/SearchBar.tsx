import { useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Search city or postcode', className = '' }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch(trimmed);
    setQuery('');
  };

  return (
    <form role="search" className={`search-bar ${className}`.trim()} onSubmit={handleSubmit}>
      <Search size={15} className="search-bar__icon" aria-hidden="true" />
      <input
        className="search-bar__input"
        type="search"
        value={query}
        placeholder={placeholder}
        aria-label="Search for a location"
        onChange={(event) => setQuery(event.target.value)}
      />
    </form>
  );
}
