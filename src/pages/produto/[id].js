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
        if (!response.ok) {
            console.error(`API Error for endpoint ${endpoint}: ${response.status} ${response.statusText}`);
            return endpoint.includes('/produtos/') ? null : [];
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Fetch error for endpoint ${endpoint}:`, error.message);
        return endpoint.includes('/produtos/') ? null : [];
    }
}
export default function ProdutoPage({ product }) {
    const router = useRouter();
    const { addToCart, cartItems } = useCart();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

    if (router.isFallback) {
        return <div className="text-center p-10">Carregando...</div>;
    }

    if (!product) {
        return <div className="text-center p-10">Produto não encontrado.</div>;
    }

    const handleOpenModal = () => {
        setQuantity(1);
        setIsModalOpen(true);
    };

    const handleConfirmAddToCart = () => {
        addToCart(product, quantity);
        setIsModalOpen(false);
    };

    const handleContactClick = () => {
        const phoneNumber = '5589981016717';
        const message = `Olá! Tenho interesse no produto: ${product.nome} - ${formatPrice(product.preco)}.`;
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const imageUrl = product.imagem_produto;

    const itemInCart = cartItems.find(item => item.id === product.id);
    const quantityInCart = itemInCart ? itemInCart.quantity : 0;
    const availableStock = product.estoque - quantityInCart;

    return (
        <>
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <button onClick={() => router.back()} className="inline-flex items-center space-x-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        <span>Voltar</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    <div>
                        {/* ---- INÍCIO DA ATUALIZAÇÃO ---- */}
                        {/* A imagem agora é um botão que abre o modal de zoom */}
                        <button onClick={() => setIsZoomModalOpen(true)} className="w-full cursor-zoom-in">
                            <div className="relative w-full aspect-square rounded-lg overflow-hidden border">
                                {imageUrl ? (
                                    <Image src={imageUrl} alt={product.nome} fill className="object-cover" priority />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-500">Sem Foto</span>
                                    </div>
                                )}
                            </div>
                        </button>
                        {/* ---- FIM DA ATUALIZAÇÃO ---- */}
                    </div>

                    <div className="flex flex-col h-full">
                        <div className="flex-grow">
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{product.nome}</h1>
                            <p className="text-3xl text-gray-800 mt-4">{formatPrice(product.preco)}</p>

                            {product.descricao && (
                                <div className="mt-8 border-t pt-8">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Descrição</h2>
                                    <div className="text-gray-600 whitespace-pre-line">
                                        {product.descricao}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 space-y-4">
                            <button
                                onClick={handleOpenModal}
                                className="w-full bg-purple-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={availableStock <= 0}
                            >
                                {availableStock > 0 ? 'Adicionar ao Pedido' : 'Sem Estoque'}
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
                                onClick={() => setQuantity(q => Math.min(availableStock, q + 1))}
                                className="h-10 w-10 border rounded-full text-lg font-bold text-purple-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={quantity >= availableStock}
                            >
                                +
                            </button>
                        </div>
                        {availableStock > 0 && (
                            <p className="text-sm text-gray-500 mb-4 -mt-2">
                                (Apenas {availableStock} unidades disponíveis para adicionar)
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
            {isZoomModalOpen && imageUrl && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 transition-opacity"
                    onClick={() => setIsZoomModalOpen(false)}
                >
                    <div className="relative max-w-4xl max-h-[90vh] w-full p-4" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={imageUrl}
                            alt={`Zoom da imagem de ${product.nome}`}
                            width={1200}
                            height={1200}
                            className="object-contain w-full h-full"
                        />
                        <button
                            onClick={() => setIsZoomModalOpen(false)}
                            className="absolute top-2 right-2 m-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
                            aria-label="Fechar zoom"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export async function getStaticPaths() {
    const produtos = await getApiData('/produtos');
    const paths = Array.isArray(produtos) ? produtos.map((prod) => ({
        params: { id: String(prod.id) },
    })) : [];
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
