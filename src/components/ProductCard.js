import Image from 'next/image';
import Link from 'next/link';

const formatPrice = (price) => {
  if (price === null || price === undefined) return 'Preço a consultar';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

export default function ProductCard({ product }) {
  if (!product) {
    return null;
  }

  const imageId = product.imagem_produtos ? product.imagem_produtos.id : null;
  const imageUrl = imageId ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${imageId}` : null;

  return (
    <div className="group bg-white border rounded-lg shadow-sm flex flex-col transition-all duration-300 hover:shadow-xl">
      <Link href={`/produto/${product.id}`} className="block">
        <div className="relative w-full aspect-square overflow-hidden rounded-t-lg">
          <div>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.nome || 'Produto sem nome'}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Sem Foto</span>
              </div>
            )}
          </div>
        </div>
      </Link>
      <div className="p-4 text-center flex-grow flex flex-col justify-between">
        <h3 className="font-semibold text-gray-800 h-12 line-clamp-2">
          {product.nome}
        </h3>
        <p className="text-xl font-bold text-purple-700 my-2">{formatPrice(product.preco)}</p>
        <Link 
          href={`/produto/${product.id}`}
          className="mt-2 bg-purple-600 text-white w-full py-2 rounded-md hover:bg-purple-700 transition-colors"
        >
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
}
