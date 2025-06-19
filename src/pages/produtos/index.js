import { useRouter } from 'next/router';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useEffect, useState } from 'react';

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

export default function ProdutosPage({ initialProducts, initialTotalCount, initialCurrentPage, initialSearch }) {
    const router = useRouter();
    const [produtos, setProdutos] = useState(initialProducts || []);
    const [totalCount, setTotalCount] = useState(initialTotalCount || 0);
    const [currentPage, setCurrentPage] = useState(initialCurrentPage || 1);
    const [searchQuery, setSearchQuery] = useState(initialSearch || '');

    const totalPages = Math.ceil(totalCount / 12);

    useEffect(() => {
        setSearchQuery(router.query.search || '');
        setCurrentPage(parseInt(router.query.page) || 1);
    }, [router.query.search, router.query.page]);

    useEffect(() => {
        async function fetchProdutos() {
            if (!searchQuery.trim()) {
                setProdutos([]);
                setTotalCount(0);
                return;
            }
            const data = await getApiData(`/produtos?search=${encodeURIComponent(searchQuery)}&page=${currentPage}&limit=12`);
            if (data) {
                setProdutos(data.products || []);
                setTotalCount(data.totalCount || 0);
            } else {
                setProdutos([]);
                setTotalCount(0);
            }
        }
        fetchProdutos();
    }, [searchQuery, currentPage]);

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <Link
                    href="/"
                    className="inline-flex items-center space-x-2 text-sm font-semibold text-purple-600 border border-purple-300 rounded-full py-2 px-4 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    <span>Voltar para os produtos</span>
                </Link>
            </div>
            <h1 className="text-3xl font-bold mb-2">
                Resultados para: <span className="text-purple-600">{searchQuery}</span>
            </h1>

            <p className="mb-6 text-gray-600">
                {totalCount} {totalCount === 1 ? 'item encontrado' : 'itens encontrados'}
            </p>

            {produtos.length === 0 ? (
                <p className="text-center text-gray-600 mt-20">Nenhum produto encontrado para essa busca.</p>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {produtos.map((prod) => (
                            <ProductCard key={prod.id} product={prod} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-10 flex-wrap items-center gap-2">
                            <Link
                                href={{
                                    pathname: '/produtos',
                                    query: { search: searchQuery, page: currentPage - 1 }
                                }}
                                className={`px-4 py-2 border rounded-md text-sm font-medium ${currentPage === 1
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none'
                                        : 'bg-white text-gray-800 border-gray-300 hover:bg-purple-100'
                                    }`}
                                aria-disabled={currentPage === 1}
                            >
                                Anterior
                            </Link>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <Link
                                    key={page}
                                    href={{
                                        pathname: '/produtos',
                                        query: { search: searchQuery, page }
                                    }}
                                    className={`px-4 py-2 border rounded-md text-sm font-medium ${page === currentPage
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-white text-gray-800 border-gray-300 hover:bg-purple-100'
                                        }`}
                                >
                                    {page}
                                </Link>
                            ))}

                            <Link
                                href={{
                                    pathname: '/produtos',
                                    query: { search: searchQuery, page: currentPage + 1 }
                                }}
                                className={`px-4 py-2 border rounded-md text-sm font-medium ${currentPage === totalPages
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none'
                                        : 'bg-white text-gray-800 border-gray-300 hover:bg-purple-100'
                                    }`}
                                aria-disabled={currentPage === totalPages}
                            >
                                Próximo
                            </Link>
                        </div>
                    )}
                </>
            )}
        </main>
    );
}

export async function getServerSideProps(context) {
    const page = parseInt(context.query.page) || 1;
    const search = context.query.search || '';

    if (!search.trim()) {
        return {
            props: {
                initialProducts: [],
                initialTotalCount: 0,
                initialCurrentPage: 1,
                initialSearch: '',
            },
        };
    }

    const data = await getApiData(`/produtos?search=${encodeURIComponent(search)}&page=${page}&limit=12`);

    return {
        props: {
            initialProducts: data?.products || [],
            initialTotalCount: data?.totalCount || 0,
            initialCurrentPage: data?.currentPage || 1,
            initialSearch: search,
        },
    };
}
