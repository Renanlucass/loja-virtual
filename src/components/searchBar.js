import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function SearchIcon() {
  return (
    <svg
      className="h-5 w-5 text-gray-500"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
}

export default function SearchBar({ initialQuery = '' }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery.length === 0) return;

    router.push(`/produtos?search=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="relative w-full sm:w-64 md:w-80 lg:w-[400px] xl:w-[500px] mx-auto rounded-full bg-pink-50"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Faça sua busca..."
        className="w-full pl-5 py-2 bg-white rounded-full text-sm placeholder-gray-500 shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
      />
      <button
        type="submit"
        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-pink-600 transition-colors"
        aria-label="Buscar"
      >
        <SearchIcon />
      </button>
    </form>
  );
}
