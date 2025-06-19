import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

function ArrowIcon({ direction = 'left' }) {
    const d = direction === 'left' 
        ? "M15 19l-7-7 7-7" 
        : "M9 5l7 7-7 7";
    return (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={d}></path>
        </svg>
    );
}

export default function ImageSlider({ images }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNext = useCallback(() => {
        if (!images || images.length === 0) return;
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, images]);

    const goToPrevious = () => {
        if (!images || images.length === 0) return;
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    useEffect(() => {
        if (images && images.length > 1) {
            const timer = setTimeout(goToNext, 5000);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, images, goToNext]);

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className="w-full max-w-5xl mx-auto my-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Peças que Nascem no Meu Ateliê</h2>

            <section className="relative w-full h-80 sm:h-72 md:h-96 rounded-2xl shadow-lg">
                <div className="w-full h-full rounded-2xl overflow-hidden">
                    {images.map((image, index) => (
                        <div 
                            key={image.id}
                            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                        >
                            {image.imagem_url && (
                                <Image
                                    src={image.imagem_url}
                                    alt={image.titulo || 'Imagem de divulgação'}
                                    fill
                                    className="object-contain"
                                    priority={index === 0}
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-6 sm:p-8 text-white">
                                <h3 className="text-xl sm:text-2xl font-bold drop-shadow-lg">{image.titulo}</h3>
                                <p className="mt-1 text-sm sm:text-base max-w-lg drop-shadow-lg">{image.descricao}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-3 sm:px-5">
                    <button onClick={goToPrevious} className="bg-black/20 p-2 rounded-full hover:bg-black/40 transition">
                        <ArrowIcon direction="left" />
                    </button>
                    <button onClick={goToNext} className="bg-black/20 p-2 rounded-full hover:bg-black/40 transition">
                        <ArrowIcon direction="right" />
                    </button>
                </div>
            </section>
        </div>
    );
}
