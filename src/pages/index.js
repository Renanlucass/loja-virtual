import CategoryCarousel from '../components/CategoryCarousel';
import ProductCard from '../components/ProductCard';
import ImageSlider from '@/components/Slider';

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

export default function HomePage({ categorias, produtosDestaque, sliderImages }) {
  return (
    <main className="container mx-auto px-4 py-8">
      
      <CategoryCarousel categorias={categorias} />

      <ImageSlider images={sliderImages} />

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Produtos em Destaque</h2>
        {produtosDestaque?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {produtosDestaque.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <p>Nenhum produto em destaque no momento.</p>
        )}
      </section>
    </main>
  );
}

export async function getServerSideProps() {
  const [categorias, produtosDestaque, bannerImage, otherSliderImages] = await Promise.all([
    getApiData('/categorias'),
    getApiData('/produtos?destaque=true'),
    getApiData('/slider/banner'), 
    getApiData('/slider')   
  ]);

  const sliderImages = [];
  if (bannerImage) {
    sliderImages.push(bannerImage); 
  }
  if (otherSliderImages && otherSliderImages.length > 0) {
    sliderImages.push(...otherSliderImages);
  }

  return {
    props: {
      categorias: categorias || [],
      produtosDestaque: produtosDestaque || [],
      sliderImages,
    }
  };
}
