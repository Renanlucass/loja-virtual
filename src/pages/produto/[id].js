import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

const formatPrice = (price) => {
  if (price === null || price === undefined) return '';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

async function getDirectusData(endpoint) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}${endpoint}`);
        if (!response.ok) throw new Error("API Error");
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

export default function ProdutoPage({ product }) {
    const router = useRouter();

    if (router.isFallback) {
        return <div>Carregando...</div>;
    }

    if (!product) {
        return <div>Produto não encontrado.</div>;
    }

    const handleContactClick = () => {
        const phoneNumber = '5589981016717';
        const message = `Olá! Tenho interesse no produto: ${product.nome} - ${formatPrice(product.preco)}.`;
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const imageId = product.imagem_produtos ? product.imagem_produtos.id : null;
    const imageUrl = imageId ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${imageId}` : null;

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <Link 
                    href="/" 
                    className="inline-flex items-center space-x-2 text-sm font-semibold text-purple-600 border border-purple-300 rounded-full py-2 px-4 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    <span>Voltar para a loja</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden">
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

                <div className="flex flex-col">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{product.nome}</h1>
                    <p className="text-3xl text-gray-800 mt-4">{formatPrice(product.preco)}</p>

                    <div className="mt-8 border-t pt-8">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Detalhes</h2>
                        <div className="prose prose-sm text-gray-600">
                            {product.descricao}
                        </div>

                        {product.tamanhos && product.tamanhos.length > 0 && (
                            <div className="mt-4">
                                <span className="font-semibold">Tamanhos disponíveis:</span> {product.tamanhos.join(', ')}
                            </div>
                        )}

                        {product.marca && (
                            <div className="mt-2">
                                <span className="font-semibold">Marca:</span> {product.marca}
                            </div>
                        )}
                        
                        {product.estoque > 0 && (
                            <div className="mt-2 text-sm text-green-700">
                                <span className="font-semibold">Em estoque:</span> {product.estoque} unidades
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-auto pt-8">
                         <button onClick={handleContactClick} className="w-full bg-purple-600 text-white py-2 rounded-md text-base font-semibold hover:bg-purple-700 transition-colors">
                            Falar com o vendedor
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export async function getStaticPaths() {
    const produtos = await getDirectusData('/items/Produtos?fields=id');
    const paths = produtos.map((prod) => ({
        params: { id: String(prod.id) },
    }));

    return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
    const id = params.id;
    const productData = await getDirectusData(`/items/Produtos/${id}?fields=*,imagem_produtos.*`);

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
