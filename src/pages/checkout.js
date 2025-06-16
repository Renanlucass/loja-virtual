import { useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

const formatPrice = (price) => {
    if (price === null || price === undefined) return '';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
};

function CopyIcon() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
    );
}

export default function CheckoutPage() {
    const { cartItems, clearCart } = useCart();
    const router = useRouter();

    const [deliveryMethod, setDeliveryMethod] = useState('entrega');
    const [formData, setFormData] = useState({
        nome: '',
        telefone: '',
        cep: '',
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        pagamento: 'PIX'
    });

    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
    const [isCepLoading, setIsCepLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const subtotal = cartItems.reduce((total, item) => total + parseFloat(item.preco) * item.quantity, 0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCepBlur = async (e) => {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length !== 8) return;
        setIsCepLoading(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (!data.erro) {
                setFormData(prev => ({ ...prev, rua: data.logradouro, bairro: data.bairro, cidade: data.localidade, estado: data.uf }));
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
        } finally {
            setIsCepLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSummaryModalOpen(true);
    };
    const handleSendOrder = async () => {
        setIsSubmitting(true);
        try {
            let enderecoCompleto = 'Retirar no local (a combinar com o vendedor)';
            if (deliveryMethod === 'entrega') {
                enderecoCompleto = `${formData.rua}, Nº ${formData.numero}, ${formData.bairro}, ${formData.cidade} - ${formData.estado}, CEP: ${formData.cep}`;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pedidos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome_cliente: formData.nome,
                    telefone_cliente: formData.telefone,
                    endereco_completo: enderecoCompleto,
                    metodo_entrega: deliveryMethod,
                    forma_pagamento: formData.pagamento,
                    itens_pedido: cartItems,
                    subtotal: subtotal
                })
            });

            if (!response.ok) {
                throw new Error('Falha ao criar o pedido na API.');
            }

            const novoPedido = await response.json();

            if (clearCart) clearCart();

            handleSendWhatsAppNotification(novoPedido.id, formData.nome);

        } catch (error) {
            console.error("Erro ao finalizar pedido:", error);
            alert("Não foi possível finalizar o seu pedido. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };


    // ---- INÍCIO DA ATUALIZAÇÃO ----
    const handleSendWhatsAppNotification = (orderId, customerName) => {
        const phoneNumber = '5589981016717';
        const receiptUrl = `${window.location.origin}/pedido/${orderId}`;
    
        const message = `
🎀 *Bem-vindo(a) ao Deusinha Ateliê!* 🎀
    
Olá ${customerName}, tudo certinho?
Recebemos o seu pedido com sucesso! 🛍️
    
📄 *Pedido:* #${orderId}
    
👉 Acesse o link a seguir para visualizar seu pedido aqui:
${receiptUrl}

Para que possamos dar andamento, por favor, envie esta mensagem para o vendedor e assim conseguiremos verificar o seu pedido e dar continuidade às próximas etapas. ✅
    
Agradecemos pela sua confiança e por escolher nossos Produtos. 💖✨
        `;
    
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message.trim())}`;
    
        if (clearCart) clearCart();
        window.open(whatsappUrl, '_blank');
        router.push('/');
    };

    const handleCopyPix = () => {
        const pixKey = '89981016717';
        navigator.clipboard.writeText(pixKey).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    const inputStyle = "mt-1 block w-full h-10 bg-gray-100 border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 p-3 text-base";

    return (
        <>
            <main className="container mx-auto px-4 py-10 max-w-2xl">
            <div className="mb-8">
                <Link
                    href="/carrinho"
                    className="inline-flex items-center space-x-2 text-sm font-semibold text-purple-600 border border-purple-300 rounded-full py-2 px-4 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    <span>Voltar para o carrinho</span>
                </Link>
            </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Finalizar Pedido</h1>

                <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-xl shadow-md">
                    <div>
                        <h2 className="text-xl font-semibold text-purple-700 mb-4">Suas Informações</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome completo *</label>
                                <input type="text" name="nome" id="nome" required value={formData.nome} onChange={handleInputChange} className={inputStyle} />
                            </div>
                            <div>
                                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone *</label>
                                <input type="tel" name="telefone" id="telefone" required value={formData.telefone} onChange={handleInputChange} className={inputStyle} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-purple-700 mb-4">Entrega</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${deliveryMethod === 'entrega' ? 'bg-purple-50 border-purple-500' : 'border-gray-200'}`}>
                                <input type="radio" name="deliveryMethod" value="entrega" checked={deliveryMethod === 'entrega'} onChange={(e) => setDeliveryMethod(e.target.value)} className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500" />
                                <span className="ml-3 text-sm font-medium text-gray-700">Receber em casa</span>
                            </label>
                            <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${deliveryMethod === 'retirada' ? 'bg-purple-50 border-purple-500' : 'border-gray-200'}`}>
                                <input type="radio" name="deliveryMethod" value="retirada" checked={deliveryMethod === 'retirada'} onChange={(e) => setDeliveryMethod(e.target.value)} className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500" />
                                <span className="ml-3 text-sm font-medium text-gray-700">Retirar no local</span>
                            </label>
                        </div>
                    </div>

                    {deliveryMethod === 'entrega' && (
                        <div>
                            <h2 className="text-xl font-semibold text-purple-700 mb-4">Endereço de Entrega</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-1">
                                    <label htmlFor="cep" className="block text-sm font-medium text-gray-700">CEP *</label>
                                    <input type="text" name="cep" id="cep" required={deliveryMethod === 'entrega'} value={formData.cep} onChange={handleInputChange} onBlur={handleCepBlur} className={inputStyle} />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="rua" className="block text-sm font-medium text-gray-700">Rua *</label>
                                    <input type="text" name="rua" id="rua" required={deliveryMethod === 'entrega'} value={formData.rua} onChange={handleInputChange} className={inputStyle} />
                                </div>
                                <div className="sm:col-span-1">
                                    <label htmlFor="numero" className="block text-sm font-medium text-gray-700">Número *</label>
                                    <input type="text" name="numero" id="numero" required={deliveryMethod === 'entrega'} value={formData.numero} onChange={handleInputChange} className={inputStyle} />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="bairro" className="block text-sm font-medium text-gray-700">Bairro *</label>
                                    <input type="text" name="bairro" id="bairro" required={deliveryMethod === 'entrega'} value={formData.bairro} onChange={handleInputChange} className={inputStyle} />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">Cidade *</label>
                                    <input type="text" name="cidade" id="cidade" required={deliveryMethod === 'entrega'} value={formData.cidade} onChange={handleInputChange} className={inputStyle} />
                                </div>
                                <div className="sm:col-span-1">
                                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado *</label>
                                    <input type="text" name="estado" id="estado" required={deliveryMethod === 'entrega'} value={formData.estado} onChange={handleInputChange} className={inputStyle} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <h2 className="text-xl font-semibold text-purple-700 mb-4">Escolha o Pagamento</h2>
                        <select name="pagamento" id="pagamento" value={formData.pagamento} onChange={handleInputChange} className={inputStyle}>
                            <option value="PIX">PIX</option>
                            <option value="Cartão de Crédito">Cartão de Crédito (Somente no Local)</option>
                            <option value="Dinheiro">Dinheiro (Somente no Local)</option>
                        </select>
                        <p className="text-sm text-gray-500 mt-2">ATENÇÃO: Pedimos que após confirmar seu pedido, envie-o para o vendedor.</p>
                    </div>

                    <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-purple-700 transition">
                        Revisar Pedido
                    </button>
                </form>
            </main>

            {isSummaryModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-gray-900/20 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-sm">
                        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Confirme seu pedido</h2>

                        <div className="space-y-1 text-gray-700 text-left">
                            <p><span className="font-semibold">Data do Pedido:</span> {new Date().toLocaleString('pt-BR')}</p>
                            <p><strong>{formData.nome}</strong></p>
                            <p>Contato: <strong>{formData.telefone}</strong></p>
                            <p className="mt-2"><strong>Opção de Entrega:</strong> {deliveryMethod === 'entrega' ? 'Receber em casa' : 'Retirar no local'}</p>
                            {deliveryMethod === 'entrega' && (
                                <>
                                    <p>{formData.rua}, {formData.numero}</p>
                                    <p>{formData.bairro}, {formData.cidade} - {formData.estado}</p>
                                    <p>{formData.cep}</p>
                                </>
                            )}
                        </div>

                        <div className="border-t my-4"></div>

                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center space-x-3 py-2">
                                <span className="bg-purple-600 text-white font-bold rounded-full h-6 w-6 flex items-center justify-center text-xs">{item.quantity}</span>
                                <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                                    {item.imagem_produto && <Image src={item.imagem_produto} alt={item.nome} fill className="object-cover" />}
                                </div>
                                <p className="flex-grow font-semibold">{item.nome}</p>
                                <p className="font-semibold">{formatPrice(item.preco * item.quantity)}</p>
                            </div>
                        ))}

                        <div className="border-t my-4"></div>

                        <div className="space-y-2 text-gray-700 text-left">
                            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
                        </div>

                        <div className="border-t my-4"></div>

                        <div className="text-left text-gray-700">
                            <p>Pagamento: <strong>Online</strong></p>
                            <p>Forma de pagamento: <strong>{formData.pagamento}</strong></p>
                            {formData.pagamento === 'PIX' && (
                                <div className="mt-2 p-3 bg-gray-100 rounded-md flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">CHAVE PIX:</p>
                                        <p className="text-purple-700 font-mono">89981016717</p>
                                    </div>
                                    <button onClick={handleCopyPix} className="text-purple-600 hover:text-purple-800 text-sm font-semibold flex items-center space-x-1">
                                        <CopyIcon />
                                        <span>{isCopied ? 'Copiado!' : 'Copiar'}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                        <button onClick={handleSendOrder} disabled={isSubmitting} className="w-full mt-6 bg-green-500 text-white py-1 rounded-2xl font-semibold text-lg hover:bg-green-600 transition disabled:bg-gray-400">
                            {isSubmitting ? 'Enviando...' : 'Confirmar e Notificar via WhatsApp'}
                        </button>
                        <button onClick={() => setIsSummaryModalOpen(false)} className="w-48 flex justify-center justify-self-center py-1 mt-4 text-xl bg-red-500 rounded-2xl text-white">Voltar e corrigir</button>
                    </div>
                </div>
            )}
        </>
    );
}
