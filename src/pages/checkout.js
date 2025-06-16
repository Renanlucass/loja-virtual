import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import CheckoutForm from '@/components/CheckoutForm';
import OrderSummaryModal from '@/components/OrderSummaryModal';

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();

  const subtotal = cartItems.reduce(
    (total, item) => total + parseFloat(item.preco) * item.quantity,
    0
  );

  const [partialFormData, setPartialFormData] = useState({
    pagamento: '',
    tipoCartao: '',
    parcelas: 1,
  });

  const [totalPedido, setTotalPedido] = useState(subtotal);

  const [finalOrderData, setFinalOrderData] = useState(null);

  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateTotalWithFees = (subtotal, pagamento, tipoCartao, parcelas) => {
    let total = subtotal;

    if (pagamento === 'cartao') {
      if (tipoCartao === 'credito') {
        if (parcelas === 1) total *= 1.05; // +5%
        else if (parcelas >= 2 && parcelas <= 3) total *= 1.054; // +5.4%
      } else if (tipoCartao === 'debito') {
        total *= 1.02; // +2%
      }
    }

    return total;
  };

  useEffect(() => {
    const novoTotal = calculateTotalWithFees(
      subtotal,
      partialFormData.pagamento,
      partialFormData.tipoCartao,
      partialFormData.parcelas
    );
    setTotalPedido(novoTotal);
  }, [partialFormData, subtotal]);

  const handlePartialFormChange = (data) => {
    setPartialFormData((prev) => ({ ...prev, ...data }));
  };

  // Ao enviar formulário final, abre modal com resumo
  const handleFormSubmit = (formData, deliveryMethod) => {
    setFinalOrderData({ formData, deliveryMethod });
    setIsSummaryModalOpen(true);
  };

  const handleSendOrder = async () => {
    if (!finalOrderData) return;

    const { formData, deliveryMethod } = finalOrderData;
    setIsSubmitting(true);

    try {
      let enderecoCompleto = 'Retirar no local (a combinar com o vendedor)';
      if (deliveryMethod === 'entrega') {
        enderecoCompleto = `${formData.rua}, Nº ${formData.numero}, ${formData.bairro}, ${formData.cidade} - ${formData.estado}, CEP: ${formData.cep}`;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome_cliente: formData.nome,
          telefone_cliente: formData.telefone,
          endereco_completo: enderecoCompleto,
          metodo_entrega: deliveryMethod,
          forma_pagamento: formData.pagamento,
          tipo_cartao: formData.tipoCartao || null,
          parcelas: formData.parcelas || 1,
          itens_pedido: cartItems,
          subtotal,
          total_pedido: totalPedido,
        }),
      });

      if (!response.ok) throw new Error('Falha ao criar o pedido na API.');

      const novoPedido = await response.json();

      if (clearCart) clearCart();

      const phoneNumber = '5589981016717';
      const receiptUrl = `${window.location.origin}/pedido/${novoPedido.id}`;
      const message = `Olá, Deusinha Ateliê! 🛍️\n\nMeu nome é *${formData.nome}* e acabei de finalizar o pedido *#${novoPedido.id}*.\n\nPode ver o resumo completo aqui:\n${receiptUrl}\n\nFico no aguardo das próximas instruções para o pagamento. Obrigado(a)! 😊`;
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message.trim())}`;

      window.open(whatsappUrl, '_blank');
      router.push('/');
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      alert('Não foi possível finalizar o seu pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (value) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <>
      <main className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="mb-8">
          <Link
            href="/carrinho"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span>Voltar ao carrinho</span>
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Finalizar Pedido
        </h1>

        <CheckoutForm
          onSubmit={handleFormSubmit}
          onChange={handlePartialFormChange}
          isSubmitting={isSubmitting}
          totalPedido={totalPedido}
          formatPrice={formatPrice}
        />
      </main>

      {isSummaryModalOpen && finalOrderData && (
        <OrderSummaryModal
          formData={finalOrderData.formData}
          deliveryMethod={finalOrderData.deliveryMethod}
          cartItems={cartItems}
          subtotal={subtotal}
          totalPedido={totalPedido}
          onConfirm={handleSendOrder}
          onClose={() => setIsSummaryModalOpen(false)}
          isSubmitting={isSubmitting}
          formatPrice={formatPrice}
        />
      )}
    </>
  );
}
