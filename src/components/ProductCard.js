import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const formatPrice = (price) => {
  if (price === null || price === undefined) return 'Preço a consultar';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return null;
  }

  const imageUrl = product.imagem_produto;
  
  const handleOpenModal = () => {
    setQuantity(1);
    setIsModalOpen(true);
  };

  const handleConfirmAddToCart = () => {
    addToCart(product, quantity);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="group bg-white border border-gray-200 rounded-2xl shadow-md flex flex-col transition-all duration-300 hover:shadow-xl hover:scale-105">
        <Link href={`/produto/${product.id}`} className="block">
          <div className="relative w-full aspect-square overflow-hidden rounded-t-2xl">
            <div className="transition-transform duration-300 group-hover:scale-110 w-full h-full">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.nome || 'Produto sem nome'}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">Sem Foto</span>
                </div>
              )}
            </div>
          </div>
        </Link>
        <div className="p-4 text-center flex-grow flex flex-col justify-between">
          <Link href={`/produto/${product.id}`}>
            <h3 className="font-medium text-gray-800 text-lg h-14 line-clamp-2 hover:text-purple-600 transition-colors">
              {product.nome}
            </h3>
          </Link>
          <p className="text-2xl font-bold text-purple-700 my-3">{formatPrice(product.preco)}</p>
          <button 
            onClick={handleOpenModal}
            className="mt-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white w-full py-3 rounded-full font-semibold text-sm shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300"
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-gray-900/20 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Selecione a Quantidade</h3>
            <div className="flex items-center space-x-4 py-4">
                <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    {imageUrl && <Image src={imageUrl} alt={product.nome} fill className="object-cover" />}
                </div>
                <p className="font-semibold text-gray-700 text-left">{product.nome}</p>
            </div>

            <div className="flex items-center justify-center space-x-4 my-6">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="h-10 w-10 border rounded-full text-lg font-bold text-purple-600 hover:bg-gray-100">-</button>
              <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => Math.min(product.estoque || q + 1, q + 1))} 
                className="h-10 w-10 border rounded-full text-lg font-bold text-purple-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity >= product.estoque}
              >
                +
              </button>
            </div>
            {product.estoque && (
              <p className="text-sm text-gray-500 mb-4 -mt-2">
                (Apenas {product.estoque} unidades em estoque)
              </p>
            )}
            <button
              onClick={handleConfirmAddToCart}
              className="w-full bg-purple-600 text-white py-2.5 rounded-md font-semibold hover:bg-purple-700 transition-colors"
            >
              Confirmar e Adicionar
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full mt-2 text-sm text-gray-500 hover:text-black"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
