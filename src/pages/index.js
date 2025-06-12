import ProductCard from '../components/ProductCard';
import CategoryCarousel from '../components/CategoryCarousel'; 

export default function HomePage({ categorias, produtosDestaque }) {

  return (
    <main className="container mx-auto px-4 py-8">

      <CategoryCarousel categorias={categorias} />

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Produtos em Destaque</h2>
        {produtosDestaque && produtosDestaque.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {produtosDestaque.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : <p>Nenhum produto em destaque no momento.</p>}
      </section>
    </main>
  );
}

export async function getStaticProps() {
  async function getDirectusData(endpoint) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  }

  const NOME_CAMPO_IMAGEM_CATEGORIA = 'imagem_ilustrativa';

  const [categorias, produtosDestaque] = await Promise.all([
    getDirectusData(`/items/Categorias?fields=id,nome,${NOME_CAMPO_IMAGEM_CATEGORIA}`),
    getDirectusData('/items/Produtos?fields=*,imagem_produtos.*&filter[destaque][_eq]=true')
  ]);

  return {
    props: {
      categorias,
      produtosDestaque,
    },
    revalidate: 60,
  };
}
