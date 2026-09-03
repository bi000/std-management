import { useState, useEffect, useRef } from 'react';

// Debounces the search callback so typing doesn't fire an API
// request on every keystroke — only once input has paused for 400ms.
function SearchBar({ onSearch, placeholder = 'Search…' }) {
  const [value, setValue] = useState('');
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch(value), 400);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <input
      type="search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className="w-full max-w-xs rounded-md border border-ink-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
    />
  );
}

export default SearchBar;
