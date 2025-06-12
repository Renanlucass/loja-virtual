import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

function TrashIcon() {
    return (
        <svg className="w-5 h-5 text-gray-500 hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    );
}

const formatPrice = (price) => {
  if (price === null || price === undefined) return '';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

export default function CarrinhoPage() {
    const { cartItems, removeFromCart, updateQuantity } = useCart();

    const subtotal = cartItems.reduce((total, item) => total + item.preco * item.quantity, 0);

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Seu Carrinho</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-12 border rounded-lg">
                    <p className="text-gray-600 mb-4">Seu carrinho está vazio.</p>
                    <Link href="/" className="bg-purple-600 text-white py-2 px-6 rounded-md hover:bg-purple-700 transition-colors">
                        Voltar para a loja
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg bg-white">
                                <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                                    <Image 
                                        src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${item.imagem_produtos.id}`}
                                        alt={item.nome}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold">{item.nome}</p>
                                    <p className="text-lg font-bold text-purple-700">{formatPrice(item.preco)}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 border rounded">-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 border rounded">+</button>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} aria-label="Remover item">
                                    <TrashIcon />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1 p-6 border rounded-lg bg-white sticky top-28">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Resumo do Pedido</h2>
                        <div className="flex justify-between mb-6">
                            <span>Subtotal</span>
                            <span className="font-bold">{formatPrice(subtotal)}</span>
                        </div>
                        <button className="w-full bg-purple-600 text-white py-3 rounded-md font-semibold hover:bg-purple-700 transition-colors">
                            Finalizar Pedido
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
