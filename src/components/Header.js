import Link from 'next/link';
import SearchBar from './searchBar';

function CartIcon() {
    return (
        <svg 
            className="h-7 w-7 text-gray-800 hover:text-black transition-colors" 
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
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
    );
}

export default function Header() {
  return (
    <header className="bg-[#e6a6ba] shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-4">
                    <div className="h-14 w-14 bg-purple-700 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                       <span className="text-white text-3xl font-bold italic">D</span>
                    </div>

                    <div className="hidden sm:block">
                       <h1 className="text-3xl font-bold text-purple-700">Deusinha Ateliê</h1>
                       <p className="text-gray-700 font-medium">Costura, Perfumaria e muito mais!</p>
                    </div>
                </Link>
                
                <div className="flex items-center space-x-4 sm:space-x-6">
                    <SearchBar />
                    <Link href="#" aria-label="Ver carrinho">
                      <CartIcon />
                    </Link>
                </div>
            </div>
        </div>
    </header>
  );
}
