import Link from 'next/link';
import ProductCard from '../../components/ProductCard';
import { useRouter } from 'next/router';
import SearchBar from '@/components/searchBar';

async function getApiData(endpoint) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

export default function CategoriaPage({ categoria, produtos }) {
    const router = useRouter();

    if (!categoria) {
        return <p className="text-center p-10">Categoria não encontrada.</p>;
    }

    return (
        <main className="container mx-auto px-4 py-4">
            <div className="mb-8">
                <Link
                    href="/"
                    className="inline-flex items-center space-x-2 text-sm font-semibold text-purple-600 border border-purple-300 rounded-full py-2 px-4 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    <span>Voltar para todas as categorias</span>
                </Link>
            </div>

            <h2 className="text-4xl font-bold mb-8 text-gray-800">
                {categoria.nome}
            </h2>

            {produtos && produtos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {produtos.map((prod) => (
                        <ProductCard key={prod.id} product={prod} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600">Nenhum produto encontrado nesta categoria ainda.</p>
            )}
        </main>
    );
}

export async function getServerSideProps(context) {
    const { id } = context.params;

    const [categoriaData, produtosData] = await Promise.all([
        getApiData(`/categorias/${id}`),
        getApiData(`/categorias/${id}/produtos?incluir_arquivados=false`)
    ]);

    if (!categoriaData) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            categoria: categoriaData,
            produtos: produtosData || [],
        },
    };
}
