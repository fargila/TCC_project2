import { useEffect } from 'react'
import { FaCheckCircle, FaShoppingCart } from "react-icons/fa"
import { useRouter } from 'next/router'
import Head from 'next/head'

interface Order {
  id: number
  date: string
  total: number
  paymentMethod: string
  installments?: number
  monthlyValue?: number
}

const OrderConfirmation = () => {
  const router = useRouter()
  const { order } = router.query

  useEffect(() => {
    window.scrollTo(0, 0)
    
    if (!order) {
      router.push('/')
    }
  }, [order, router])

  const handleContinueShopping = () => {
    router.push('/')
  }

  if (!order) return null

  let parsedOrder: Order
  try {
    parsedOrder = JSON.parse(order as string)
  } catch {
    router.push('/')
    return null
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value)
  }

  const getPaymentMethodName = (method: string) => {
    switch(method) {
      case 'credit': return `Cartão de Crédito (${parsedOrder.installments}x)`
      case 'debit': return 'Cartão de Débito'
      case 'pix': return 'PIX'
      case 'boleto': return 'Boleto'
      default: return method
    }
  }

  return (
    <>
      <Head>
        <title>Confirmação de Pedido | Sua Loja</title>
        <meta name="description" content="Confirmação do seu pedido" />
      </Head>

      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center
        rounded-b-3xl border-b-8 border-blue-300 ring-2 ring-black mt-20 mb-56">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Pedido Confirmado!</h1>
          <p className="text-lg mb-6">Obrigado por sua compra.</p>
          
          <div className="text-left mb-6 space-y-2">
            <p><strong>Número do pedido:</strong> #{parsedOrder.id}</p>
            <p><strong>Data:</strong> {new Date(parsedOrder.date).toLocaleDateString('pt-BR')}</p>
            <p><strong>Total:</strong> {formatCurrency(parsedOrder.total)}</p>
            <p><strong>Pagamento:</strong> {getPaymentMethodName(parsedOrder.paymentMethod)}</p>
            {parsedOrder.paymentMethod === 'credit' && parsedOrder.installments && parsedOrder.installments > 1 && (
              <p><strong>Valor por parcela:</strong> {formatCurrency(parsedOrder.monthlyValue || 0)}</p>
            )}
          </div>

          <button
            onClick={handleContinueShopping}
            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            aria-label="Continuar comprando"
          >
            <FaShoppingCart />
            Continuar comprando
          </button>
        </div>
      </div>
    </>
  )
}

export default OrderConfirmation