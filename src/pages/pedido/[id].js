import { useRouter } from 'next/router';
import Image from 'next/image';

const formatPrice = (price) => {
  if (price === null || price === undefined) return '';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
};

async function getApiData(endpoint) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

export default function PedidoConfirmadoPage({ pedido }) {
    const router = useRouter();

    if (!pedido) {
        return <div className="text-center p-10">Pedido não encontrado.</div>;
    }

    return (
        <main className="container mx-auto px-4 py-10 max-w-2xl">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-green-600">Pedido Recebido com Sucesso!</h1>
                    <p className="text-gray-600 mt-2">Este é o resumo do seu pedido. Guarde este link para referência futura.</p>
                </div>

                <div className="space-y-2 text-gray-700 text-left mb-6">
                    <p><strong>Pedido:</strong> #{pedido.id}</p>
                    <p><strong>Data:</strong> {new Date(pedido.created_at).toLocaleString('pt-BR')}</p>
                    <p><strong>Cliente:</strong> {pedido.nome_cliente}</p>
                    <p><strong>Contato:</strong> {pedido.telefone_cliente}</p>
                    <p><strong>Entrega:</strong> {pedido.endereco_completo}</p>
                </div>

                <div className="border-t my-4"></div>
                <h3 className="font-bold text-lg mb-2">Itens:</h3>
                <div className="space-y-3">
                    {pedido.itens_pedido.map(item => (
                         <div key={item.id} className="flex items-center space-x-4">
                             <span className="bg-purple-600 text-white font-bold rounded-full h-6 w-6 flex items-center justify-center text-xs flex-shrink-0">{item.quantity}</span>
                             <div className="relative w-14 h-14 rounded-md overflow-hidden flex-shrink-0">
                                 {item.imagem_produto && <Image src={item.imagem_produto} alt={item.nome} fill className="object-cover" />}
                             </div>
                             <p className="flex-grow font-semibold">{item.nome}</p>
                             <p className="font-semibold text-right">{formatPrice(item.preco * item.quantity)}</p>
                         </div>
                    ))}
                </div>
                
                <div className="border-t my-4"></div>
                
                <div className="space-y-2 text-gray-700 text-left">
                     <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(pedido.subtotal)}</span></div>
                     <div className="flex justify-between font-bold text-lg"><span>Total do Pedido</span><span>{formatPrice(pedido.subtotal)}</span></div>
                </div>

                <div className="border-t my-4"></div>

                <div className="text-left text-gray-700">
                    <p><strong>Forma de pagamento:</strong> {pedido.forma_pagamento}</p>
                </div>
            </div>
        </main>
    );
}

export async function getServerSideProps(context) {
    const { id } = context.params;

    const pedido = await getApiData(`/pedidos/${id}`);

    if (!pedido) {
        return {
            notFound: true,
        };
    }

    return {
        props: { pedido },
    };
}
