import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/router';

function TrashIcon() {
    return (
        <svg className="w-5 h-5 text-gray-400 hover:text-red-600 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    );
}

const formatPrice = (price) => {
  if (price === null || price === undefined) return '';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
};

export default function CarrinhoPage() {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const router = useRouter();

    const subtotal = cartItems.reduce((total, item) => total + item.preco * item.quantity, 0);

    return (
        <main className="container mx-auto px-4 py-10">
            <div className="mb-8">
                <Link
                    href="/"
                    className="inline-flex items-center space-x-2 text-sm font-semibold text-purple-600 border border-purple-300 rounded-full py-2 px-4 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    <span>Voltar para os produtos</span>
                </Link>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-10 text-center">Seu Carrinho</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-20 border rounded-xl bg-white shadow-md">
                    <p className="text-gray-600 mb-6 text-lg">Seu carrinho está vazio.</p>
                    <Link href="/" className="bg-purple-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-purple-700 transition">
                        Ver produtos
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    <div className="lg:col-span-2 space-y-5">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center space-x-3 sm:space-x-5 p-3 sm:p-5 border rounded-xl bg-white shadow-sm">
                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0">
                                    {item.imagem_produto ? (
                                        <Image 
                                            src={item.imagem_produto}
                                            alt={item.nome}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200"></div>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold text-base sm:text-lg">{item.nome}</p>
                                    <p className="text-purple-700 text-lg sm:text-xl font-bold">{formatPrice(item.preco)}</p>
                                </div>

                                <div className="flex items-center space-x-1 sm:space-x-2">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 sm:px-3 py-1 border rounded-lg hover:bg-gray-100 text-lg">-</button>
                                    <span className="font-semibold w-8 text-center text-base sm:text-lg">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                                        className="px-2 sm:px-3 py-1 border rounded-lg hover:bg-gray-100 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={item.quantity >= item.estoque}
                                    >
                                        +
                                    </button>
                                </div>

                                <button onClick={() => removeFromCart(item.id)} aria-label="Remover item">
                                    <TrashIcon />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1 p-6 border rounded-xl bg-white shadow-md sticky top-28">
                        <h2 className="text-2xl font-semibold mb-4 pb-2 border-b">Resumo do Pedido</h2>
                        <div className="flex justify-between mb-6">
                            <span>Subtotal</span>
                            <span className="font-bold text-lg">{formatPrice(subtotal)}</span>
                        </div>

                        <Link href="/checkout" className="block w-full text-center bg-purple-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-purple-700 transition">
                            Finalizar Pedido
                        </Link>
                    </div>
                </div>
            )}
        </main>
    );
}
