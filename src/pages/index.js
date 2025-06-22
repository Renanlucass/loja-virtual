import CategoryCarousel from '../components/CategoryCarousel';
import ProductCard from '../components/ProductCard';
import ImageSlider from '@/components/Slider';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

async function getApiData(endpoint) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

export default function HomePage({
  categorias,
  bannerImage,
  sliderImages,
  produtosDestaque,
  totalCount,
}) {
  const router = useRouter();

  const [produtos, setProdutos] = useState(produtosDestaque);
  const [totalCountState, setTotalCount] = useState(totalCount);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const totalPages = Math.ceil(totalCountState / 12);

  useEffect(() => {
    if (!router.isReady) return;

    const page = parseInt(router.query.page) || 1;
    const search = router.query.search || '';

    if (page === currentPage && search === searchQuery) return;

    setCurrentPage(page);
    setSearchQuery(search);
    setIsLoading(true);

    getApiData(`/produtos?destaque=true&page=${page}&limit=12&search=${encodeURIComponent(search)}`)
      .then((data) => {
        setProdutos(data?.products || []);
        setTotalCount(data?.totalCount || 0);
      })
      .finally(() => setIsLoading(false));
  }, [router.isReady, router.query.page, router.query.search]);

  return (
    <main className="container mx-auto px-4 py-8">
      {bannerImage && (
        <section className="mb-12">
          <div className="relative w-full h-48 sm:h-64 md:h-80 rounded-2xl shadow-lg overflow-hidden">
            <Image
              src={bannerImage.imagem_url}
              alt={bannerImage.titulo || 'Banner de divulgação'}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-6 sm:p-8">
              <h2 className="text-white text-2xl sm:text-3xl font-bold drop-shadow-lg">{bannerImage.titulo}</h2>
              <p className="text-white text-sm sm:text-base mt-1 drop-shadow-lg">{bannerImage.descricao}</p>
            </div>
          </div>
        </section>
      )}

      <CategoryCarousel categorias={categorias} />
      <ImageSlider images={sliderImages} />

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Produtos em Destaque</h2>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : produtos.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {produtos.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-10 flex-wrap items-center gap-2">
                <Link
                  href={`/?page=${currentPage - 1}&search=${encodeURIComponent(searchQuery)}`}
                  scroll={false}
                  className={`px-4 py-2 border rounded-md text-sm font-medium ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-purple-100'
                  }`}
                  aria-disabled={currentPage === 1}
                >
                  Anterior
                </Link>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Link
                    key={page}
                    href={`/?page=${page}&search=${encodeURIComponent(searchQuery)}`}
                    scroll={false}
                    className={`px-4 py-2 border rounded-md text-sm font-medium ${
                      page === currentPage
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-purple-100'
                    }`}
                  >
                    {page}
                  </Link>
                ))}

                <Link
                  href={`/?page=${currentPage + 1}&search=${encodeURIComponent(searchQuery)}`}
                  scroll={false}
                  className={`px-4 py-2 border rounded-md text-sm font-medium ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-purple-100'
                  }`}
                  aria-disabled={currentPage === totalPages}
                >
                  Próximo
                </Link>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-600 mt-20">Nenhum produto em destaque no momento.</p>
        )}
      </section>
    </main>
  );
}

export async function getStaticProps() {
  const [categorias, produtosDestaqueData, bannerImage, sliderImages] = await Promise.all([
    getApiData('/categorias'),
    getApiData(`/produtos?destaque=true&page=1&limit=12`),
    getApiData('/slider/banner'),
    getApiData('/slider'),
  ]);

  return {
    props: {
      categorias: categorias || [],
      produtosDestaque: produtosDestaqueData?.products || [],
      totalCount: produtosDestaqueData?.totalCount || 0,
      bannerImage: bannerImage || null,
      sliderImages: sliderImages || [],
    },
    revalidate: 3600, 
  };
}
