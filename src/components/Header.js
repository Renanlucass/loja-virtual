import Link from 'next/link';
import Image from 'next/image';
import SearchBar from './searchBar';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

function CartIcon() {
    return (
        <svg 
            className="h-7 w-7 text-gray-800 group-hover:text-black transition-colors" 
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
    const { cartItems } = useCart();
    const distinctItemsCount = cartItems.length;
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

  return (
    <header className="bg-[#e6a6ba] shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3">
                        <div className="relative h-16 w-28 sm:h-16 sm:w-16 flex-shrink-0">
                           <Image
                              src="/logo-atelie.jpg" 
                              alt="Logo do Deusinha Ateliê"
                              layout="fill"
                              objectFit="contain"
                           />
                        </div>
                        <div>
                           <h1 className="text-xl sm:text-2xl font-bold text-purple-700">Deusinha Ateliê</h1>
                           <p className="text-xs sm:text-sm text-gray-700 font-medium">Costura, Perfumaria e muito mais!</p>
                        </div>
                    </Link>
                    
                    <Link href="/carrinho" aria-label="Ver carrinho" className="relative group">
                      <CartIcon />
                      {isClient && distinctItemsCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {distinctItemsCount}
                        </span>
                      )}
                    </Link>
                </div>
                <div className="w-full flex justify-center">
                    <div className="w-full flex justify-center max-w-lg">
                        <SearchBar />
                    </div>
                </div>
            </div>
        </div>
    </header>
  );
}
