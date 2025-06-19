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

export default function SearchBar() {
  return (
    <div className="relative w-full flex justify-center justify-self-center max-w-xs rounded-full bg-pink-50">
      <input
        type="text"
        placeholder="Faça sua busca..."
        className="w-full pl-5 py-2 flex justify-center bg-white rounded-full text-sm placeholder-gray-500 shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <SearchIcon />
      </div>
    </div>
  );
}
