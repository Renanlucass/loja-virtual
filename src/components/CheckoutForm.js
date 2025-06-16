import { useState } from 'react';

export default function CheckoutForm({ onSubmit, onChange, isSubmitting, totalPedido, formatPrice }) {
    const [pagamento, setPagamento] = useState('');
    const [tipoCartao, setTipoCartao] = useState('');
    const [parcelas, setParcelas] = useState(1);
    const [deliveryMethod, setDeliveryMethod] = useState('retirada');

    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [cep, setCep] = useState('');
    const [loadingCep, setLoadingCep] = useState(false);

    const updateParent = (fields) => {
        onChange({
            pagamento,
            tipoCartao,
            parcelas,
            ...fields,
        });
    };

    const handleCepBlur = async () => {
        if (cep.length < 8) return;
        setLoadingCep(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (!data.erro) {
                setRua(data.logradouro || '');
                setBairro(data.bairro || '');
                setCidade(data.localidade || '');
                setEstado(data.uf || '');
            }
        } catch (err) {
            console.error("Erro ao buscar o CEP:", err);
        }
        setLoadingCep(false);
    };

    const handlePagamentoChange = (e) => {
        const val = e.target.value;
        setPagamento(val);
        setTipoCartao('');
        setParcelas(1);
        updateParent({ pagamento: val, tipoCartao: '', parcelas: 1 });
    };

    const handleTipoCartaoChange = (e) => {
        const val = e.target.value;
        setTipoCartao(val);
        updateParent({ tipoCartao: val });
    };

    const handleParcelasChange = (e) => {
        const val = Number(e.target.value);
        setParcelas(val);
        updateParent({ parcelas: val });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            nome,
            telefone,
            pagamento,
            tipoCartao,
            parcelas,
            rua,
            numero,
            bairro,
            cidade,
            estado,
            cep,
        };

        onSubmit(formData, deliveryMethod);
    };

    const labelClass = "block text-sm font-semibold text-gray-700 mb-1";
    const inputClass = "w-full border border-gray-300 rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500";

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>Nome completo</label>
                    <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required className={inputClass} placeholder="Seu nome completo" />
                </div>

                <div>
                    <label className={labelClass}>Telefone</label>
                    <input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} required className={inputClass} placeholder="(99) 99999-9999" />
                </div>
            </div>

            <div>
                <label className={labelClass}>Método de entrega</label>
                <select value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value)} className={inputClass}>
                    <option value="retirada">Retirar no local</option>
                    <option value="entrega">Entrega</option>
                </select>
            </div>

            {deliveryMethod === 'entrega' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="sm:col-span-3">
                        <label className={labelClass}>Rua</label>
                        <input type="text" value={rua} onChange={(e) => setRua(e.target.value)} required className={inputClass} placeholder="Rua" />
                    </div>
                    <div>
                        <label className={labelClass}>CEP</label>
                        <input
                            type="text"
                            value={cep}
                            onChange={(e) => setCep(e.target.value)}
                            onBlur={handleCepBlur}
                            required
                            className={inputClass}
                            placeholder="CEP"
                        />
                        {loadingCep && <p className="text-sm text-gray-500 mt-1">Buscando endereço...</p>}
                    </div>
                    <div>
                        <label className={labelClass}>Número</label>
                        <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} required className={inputClass} placeholder="Número" />
                    </div>
                    <div>
                        <label className={labelClass}>Bairro</label>
                        <input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} required className={inputClass} placeholder="Bairro" />
                    </div>
                    <div>
                        <label className={labelClass}>Cidade</label>
                        <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} required className={inputClass} placeholder="Cidade" />
                    </div>
                    <div>
                        <label className={labelClass}>Estado</label>
                        <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} required className={inputClass} placeholder="Estado" />
                    </div>
                </div>
            )}

            <div>
                <label className={labelClass}>Forma de pagamento</label>
                <select value={pagamento} onChange={handlePagamentoChange} required className={inputClass}>
                    <option value="">Selecione</option>
                    <option value="cartao">Cartão (Presencialmente Apenas)</option>
                    <option value="pix">PIX</option>
                    <option value="dinheiro">Dinheiro (Somente no Local)</option>
                </select>

                {pagamento === 'cartao' && (
                    <p className="mt-2 text-sm text-yellow-600">
                        ⚠️ Pagamentos no cartão podem ter acréscimos de taxas dependendo da forma e número de parcelas.
                    </p>
                )}
            </div>

            {pagamento === 'cartao' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Tipo do cartão</label>
                        <select value={tipoCartao} onChange={handleTipoCartaoChange} required className={inputClass}>
                            <option value="">Selecione</option>
                            <option value="credito">Crédito</option>
                            <option value="debito">Débito</option>
                        </select>
                    </div>

                    {tipoCartao === 'credito' && (
                        <div>
                            <label className={labelClass}>Parcelas</label>
                            <select value={parcelas} onChange={handleParcelasChange} required className={inputClass}>
                                <option value={1}>1x</option>
                                <option value={2}>2x</option>
                                <option value={3}>3x</option>
                            </select>
                        </div>
                    )}
                </div>
            )}

            <div className="text-right font-bold text-lg mt-6">
                Valor Final: {formatPrice(totalPedido)}
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-purple-700 transition disabled:opacity-50">
                {isSubmitting ? 'Enviando...' : 'Finalizar Pedido'}
            </button>

            <p className="mt-4 text-sm text-gray-600 text-center">
                📩 Após revisar e finalizar o pedido, não se esqueça de enviá-lo ao vendedor pelo WhatsApp para darmos continuidade. 😊
            </p>
        </form>
    );
}
