import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCart } from '../../context/CartContext'; 
import { useState } from 'react';

const formatPrice = (price) => {
  if (price === null || price === undefined) return '';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};


async function getApiData(endpoint) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`);
        if (!response.ok) throw new Error("API Error");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

export default function ProdutoPage({ product }) {
    const router = useRouter();
    const { addToCart } = useCart(); 
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (router.isFallback) {
        return <div className="text-center p-10">Carregando...</div>;
    }

    if (!product) {
        return <div className="text-center p-10">Produto não encontrado.</div>;
    }

    const handleAddToCart = () => {
        addToCart(product);
        setIsModalOpen(true);
    };

    const handleContactClick = () => {
        const phoneNumber = '89981016717';
        const message = `Olá! Tenho interesse no produto: ${product.nome} - ${formatPrice(product.preco)}.`;
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const imageUrl = product.imagem_produto;

    return (
        <>
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center space-x-2 text-sm font-semibold text-purple-600 border border-purple-300 rounded-full py-2 px-4 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        <span>Voltar para a loja</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    <div>
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden border">
                            {imageUrl ? (
                                <Image
                                    src={imageUrl}
                                    alt={product.nome}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500">Sem Foto</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col h-full">
                        <div className="flex-grow">
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{product.nome}</h1>
                            <p className="text-3xl text-gray-800 mt-4">{formatPrice(product.preco)}</p>
                            
                            {product.descricao && (
                                <div className="mt-8 border-t pt-8">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Descrição</h2>
                                    <div 
                                        className="prose prose-sm text-gray-600 max-w-none"
                                        dangerouslySetInnerHTML={{ __html: product.descricao }} 
                                    />
                                </div>
                            )}

                            {product.caracteristicas && (
                                <div className="mt-8">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4">O que você precisa saber</h2>
                                    <div 
                                        className="prose prose-sm text-gray-600 max-w-none prose-ul:list-disc prose-ul:pl-5"
                                        dangerouslySetInnerHTML={{ __html: product.caracteristicas }} 
                                    />
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-8 space-y-4">
                            <button 
                                onClick={handleAddToCart}
                                className="w-full bg-purple-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-purple-700 transition-colors"
                            >
                                Adicionar ao Pedido
                            </button>
                            <Link href="/" className="w-full block text-center border-2 border-purple-600 text-purple-600 py-3 rounded-md text-lg font-semibold hover:bg-purple-50 transition-colors">
                                Continuar comprando
                            </Link>

                            <div className="text-center pt-4">
                                <p className="text-sm text-gray-500 mb-2">Ficou com alguma dúvida?</p>
                                <button onClick={handleContactClick} className="font-semibold text-purple-600 border-b border-purple-600 hover:text-purple-800 hover:border-purple-800 transition-colors">
                                    Falar com o vendedor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {isModalOpen && (
                <div 
                    className={`fixed inset-0 flex items-center justify-center z-50 p-4 bg-gray-900/20 backdrop-blur-sm transition-opacity duration-300 ${isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <div 
                        className={`bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ${isModalOpen ? 'scale-100' : 'scale-95'}`}
                    >
                        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Produto adicionado ao seu carrinho</h2>
                        
                        <div className="flex items-center space-x-4 border-t border-b py-4">
                            <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                {imageUrl ? (
                                    <Image src={imageUrl} alt={product.nome} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-200"></div>
                                )}
                            </div>
                            <div className="flex-grow">
                                <p className="font-semibold text-gray-800">{product.nome}</p>
                                <p className="text-sm text-gray-500">{formatPrice(product.preco)}</p>
                                <p className="text-sm text-gray-500">Quantidade: 1</p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <Link href="/carrinho" className="block w-full text-center bg-purple-600 text-white py-2.5 rounded-md font-semibold hover:bg-purple-700 transition-colors">
                                Ir para o carrinho
                            </Link>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="w-full text-center border-2 border-gray-300 text-gray-700 py-2.5 rounded-md font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Continuar comprando
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export async function getStaticPaths() {

    const produtos = await getApiData('/produtos');
    const paths = produtos.map((prod) => ({
        params: { id: String(prod.id) },
    }));
    return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
    const id = params.id;

    const productData = await getApiData(`/produtos/${id}`);

    if (!productData) {
        return { notFound: true };
    }

    return {
        props: {
            product: productData,
        },
        revalidate: 60,
    };
}
