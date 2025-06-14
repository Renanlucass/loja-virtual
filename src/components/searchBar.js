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
      <div className="relative w-full max-w-xs">
        <input
          type="text"
          placeholder="Faça sua busca..."
          className="w-full pl-5 py-2 flex justify-center border-2 border-transparent bg-white/50 rounded-full text-sm placeholder-gray-500 focus:outline-none focus:bg-white focus:border-purple-300 transition-colors"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <SearchIcon />
        </div>
      </div>
    );
  }
