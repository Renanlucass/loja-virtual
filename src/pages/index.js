import CategoryCarousel from '../components/CategoryCarousel';
import ProductCard from '../components/ProductCard';
import ImageSlider from '@/components/Slider';
import Image from 'next/image';
import Link from 'next/link';

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

export default function HomePage({ categorias, produtosDestaque, totalCount, currentPage, bannerImage, sliderImages, searchQuery }) {
  const totalPages = Math.ceil(totalCount / 12);

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

        {produtosDestaque?.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {produtosDestaque.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-10 flex-wrap items-center gap-2">

                <Link
                  href={`/?page=${currentPage - 1}&search=${encodeURIComponent(searchQuery)}`}
                  scroll={false}
                  className={`px-4 py-2 border rounded-md text-sm font-medium ${currentPage === 1
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
                    className={`px-4 py-2 border rounded-md text-sm font-medium ${page === currentPage
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
                  className={`px-4 py-2 border rounded-md text-sm font-medium ${currentPage === totalPages
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
          <p>Nenhum produto em destaque no momento.</p>
        )}
      </section>
    </main>
  );
}

export async function getServerSideProps(context) {
  const page = parseInt(context.query.page) || 1;
  const search = context.query.search || '';

  const [categorias, produtosDestaqueData, bannerImage, sliderImages] = await Promise.all([
    getApiData('/categorias'),
    getApiData(`/produtos?destaque=true&page=${page}&limit=12&search=${encodeURIComponent(search)}`),
    getApiData('/slider/banner'),
    getApiData('/slider'),
  ]);

  return {
    props: {
      categorias: categorias || [],
      produtosDestaque: produtosDestaqueData?.products || [],
      totalCount: produtosDestaqueData?.totalCount || 0,
      currentPage: produtosDestaqueData?.currentPage || 1,
      bannerImage: bannerImage || null,
      sliderImages: sliderImages || [],
      searchQuery: search,
    },
  };
}
