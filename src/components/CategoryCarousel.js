import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function ArrowLeftIcon() {
  return (
    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
  );
}

export default function CategoryCarousel({ categorias }) {
  const scrollContainer = useRef(null);

  const scroll = (direction) => {
    if (scrollContainer.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      scrollContainer.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Navegue por Categorias</h2>
      {categorias && categorias.length > 0 ? (
        <div className="relative">
          <div className="md:hidden">
            <button 
              onClick={() => scroll('left')} 
              className="absolute top-12 -translate-y-1/2 left-0 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-white active:scale-90 transition-transform"
              aria-label="Rolar para esquerda"
            >
              <ArrowLeftIcon />
            </button>
            <button 
              onClick={() => scroll('right')} 
              className="absolute top-12 -translate-y-1/2 right-0 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-white active:scale-90 transition-transform"
              aria-label="Rolar para direita"
            >
              <ArrowRightIcon />
            </button>
          </div>
          <div 
            ref={scrollContainer}
            className="flex space-x-4 overflow-x-auto md:grid md:grid-cols-4 md:gap-x-6 md:gap-y-8 md:space-x-0 p-2 md:p-0 scrollbar-hide"
          >
            {categorias.map((cat, index) => (
              <div key={cat.id} className="text-center flex-shrink-0 w-24 md:w-auto">
                <Link href={`/categorias/${cat.id}`} className="group inline-block">
                  <div className="relative h-24 w-24 md:h-32 md:w-32 mx-auto rounded-full overflow-hidden shadow-lg transform transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                    {cat.imagem_ilustrativa && (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${cat.imagem_ilustrativa}`}
                        alt={cat.nome || 'Categorias'}
                        fill
                        sizes="(max-width: 768px) 33vw, 25vw"
                        className="object-cover"
                        priority={index < 4}
                      />
                    )}
                  </div>
                </Link>
                <h3 className="mt-4 text-base font-semibold text-gray-700">{cat.nome}</h3>
              </div>
            ))}
          </div>
        </div>
      ) : <p>Categorias não encontradas.</p>}
    </section>
  );
}
