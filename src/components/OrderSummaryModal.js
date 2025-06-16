import { useState } from 'react';
import Image from 'next/image';

const formatPrice = (price) => {
    if (price === null || price === undefined) return '';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
};

function CopyIcon() {
    return (
        <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            ></path>
        </svg>
    );
}

export default function OrderSummaryModal({
    formData,
    deliveryMethod,
    cartItems,
    subtotal,
    totalPedido,
    onConfirm,
    onClose,
    isSubmitting,
}) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyPix = () => {
        const pixKey = '89981016717';
        navigator.clipboard.writeText(pixKey).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-gray-900/20 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-sm max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Confirme seu pedido</h2>

                <div className="space-y-1 text-gray-700 text-left mb-4">
                    <p>
                        <span className="font-semibold">Data do Pedido:</span> {new Date().toLocaleString('pt-BR')}
                    </p>
                    <p>
                        <strong>{formData.nome}</strong>
                    </p>
                    <p>
                        Contato: <strong>{formData.telefone}</strong>
                    </p>
                    <p className="mt-2">
                        <strong>Opção de Entrega:</strong> {deliveryMethod === 'entrega' ? 'Receber em casa' : 'Retirar no local'}
                    </p>
                    {deliveryMethod === 'entrega' && (
                        <>
                            <p>
                                {formData.rua}, Nº {formData.numero}
                            </p>
                            <p>
                                {formData.bairro}, {formData.cidade} - {formData.estado}
                            </p>
                            <p>{formData.cep}</p>
                        </>
                    )}
                </div>

                <div className="border-t my-4"></div>

                {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 py-2">
                        <span className="bg-purple-600 text-white font-bold rounded-full h-6 w-6 flex items-center justify-center text-xs">
                            {item.quantity}
                        </span>
                        <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                            {item.imagem_produto && (
                                <Image src={item.imagem_produto} alt={item.nome} fill className="object-cover" />
                            )}
                        </div>
                        <p className="flex-grow font-semibold">{item.nome}</p>
                        <p className="font-semibold">{formatPrice(item.preco * item.quantity)}</p>
                    </div>
                ))}

                <div className="border-t my-4"></div>

                <div className="space-y-2 text-gray-700 text-left">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>{formatPrice(totalPedido)}</span>
                    </div>
                </div>

                <div className="border-t my-4"></div>

                <div className="text-left text-gray-700">
                    <p>
                        Pagamento: <strong>Online</strong>
                    </p>
                    <p>
                        Forma de pagamento: <strong>{formData.pagamento}</strong>
                    </p>
                    {formData.pagamento === 'PIX' && (
                        <div className="mt-2 p-3 bg-gray-100 rounded-md flex items-center justify-between">
                            <div>
                                <p className="font-semibold">CHAVE PIX:</p>
                                <p className="text-purple-700 font-mono">89981016717</p>
                            </div>
                            <button
                                onClick={handleCopyPix}
                                className="text-purple-600 hover:text-purple-800 text-sm font-semibold flex items-center space-x-1"
                                type="button"
                            >
                                <CopyIcon />
                                <span>{isCopied ? 'Copiado!' : 'Copiar'}</span>
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={onConfirm}
                    disabled={isSubmitting}
                    className="w-full mt-6 flex justify-center align-self-center bg-green-500 text-white py-3 rounded-2xl font-semibold text-lg hover:bg-green-600 transition disabled:bg-gray-400"
                    type="button"
                >
                    {isSubmitting ? 'Enviando...' : 'Confirmar e Notificar via WhatsApp'}
                </button>
                <button
                    onClick={onClose}
                    className="w-1/2 mt-2 text-xl flex justify-center justify-self-center bg-red-500 py-1 rounded-2xl text-white hover:text-black"
                    type="button"
                >
                    Voltar e corrigir
                </button>
                <p className="mt-4 text-sm text-gray-600 text-center">
                    📩 Após finalizar o pedido, você será direcionado até o contato do vendedor, pedimos que nos envie o seu pedido. 😊
                </p>
            </div>
        </div>
    );
}
