import { useState } from 'react'
import { innerBrazil } from './types/ufs'
import { FaPix, FaCheck, FaBarcode } from "react-icons/fa6"
import { FaCreditCard, FaMoneyBillAlt, FaShoppingCart } from "react-icons/fa"
import { Book } from './types/Book'
import { useRouter } from 'next/router'
import Head from 'next/head'

interface PurchaseProps {
  cartItems: Book[]
  onNavigateBack: () => void
}

interface Address {
  cep: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
}

interface InstallmentOption {
  installments: number
  value: number
  totalWithFee: number
}

const Purchase = ({ cartItems }: PurchaseProps) => {
  const router = useRouter()
  const [ufs, setUfs] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [address, setAddress] = useState<Address>({
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: ''
  })
  const [selectedInstallment, setSelectedInstallment] = useState(1)

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
  const shipping = subtotal > 200 ? 0 : 15
  const total = subtotal + shipping

  const installmentOptions: InstallmentOption[] = Array.from({ length: 12 }, (_, i) => {
    const installments = i + 1
    const feePercentage = i * 0.05
    const totalWithFee = total * (1 + feePercentage)
    const monthlyValue = totalWithFee / installments
    
    return {
      installments,
      value: parseFloat(monthlyValue.toFixed(2)),
      totalWithFee: parseFloat(totalWithFee.toFixed(2))
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setAddress(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!paymentMethod) {
      alert('Selecione um método de pagamento')
      return
    }

    if (!address.cep || !address.street || !address.number || !address.city || !ufs) {
      alert('Preencha todos os campos obrigatórios do endereço')
      return
    }

    const selectedOption = installmentOptions.find(opt => opt.installments === selectedInstallment)
    
    const newOrder = {
      id: Date.now(),
      date: new Date().toISOString(),
      address: { ...address, state: ufs },
      paymentMethod,
      items: cartItems,
      subtotal,
      shipping,
      total: paymentMethod === 'credit' ? selectedOption?.totalWithFee || total : total,
      installments: paymentMethod === 'credit' ? selectedInstallment : 1,
      monthlyValue: paymentMethod === 'credit' ? selectedOption?.value : total
    }

    router.push({
      pathname: '/order-confirmation',
      query: { order: JSON.stringify(newOrder) }
    })
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    })
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 my-36">
        <FaShoppingCart className="text-5xl text-gray-400" />
        <p className="text-xl text-gray-600">Seu carrinho está vazio</p>
        <button 
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Voltar para a loja
        </button>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Finalizar Compra | Sua Loja</title>
        <meta name="description" content="Finalize sua compra na nossa loja de livros" />
      </Head>

      <div className="flex justify-center my-36 px-4">
        <form className="w-full max-w-4xl" onSubmit={handleSubmit}>
          <h1 className="my-8 text-3xl md:text-4xl font-bold text-center">Finalizar Compra</h1>

          {/* Address Section */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 p-6 bg-gray-100 rounded-xl border-b-4 border-blue-400 ring-2 ring-blue-300 shadow-lg">
            <input 
              className="h-12 rounded-xl pl-3 md:col-span-3 border border-gray-400 focus:ring-2 focus:ring-blue-500" 
              type="text" 
              placeholder="CEP" 
              name="cep"
              value={address.cep}
              onChange={handleInputChange}
              required
            />
            <input 
              className="h-12 rounded-xl pl-3 md:col-span-6 border border-gray-400 focus:ring-2 focus:ring-blue-500" 
              type="text" 
              placeholder="Endereço" 
              name="street"
              value={address.street}
              onChange={handleInputChange}
              required
            />
            <input 
              className="h-12 rounded-xl pl-3 md:col-span-2 border border-gray-400 focus:ring-2 focus:ring-blue-500" 
              type="number" 
              placeholder="Número" 
              name="number"
              value={address.number}
              onChange={handleInputChange}
              required
            />
            <input 
              className="h-12 rounded-xl pl-3 md:col-span-4 border border-gray-400 focus:ring-2 focus:ring-blue-500" 
              type="text" 
              placeholder="Complemento (opcional)" 
              name="complement"
              value={address.complement}
              onChange={handleInputChange}
            />
            <input 
              className="h-12 rounded-xl pl-3 md:col-span-3 border border-gray-400 focus:ring-2 focus:ring-blue-500" 
              type="text" 
              placeholder="Bairro" 
              name="neighborhood"
              value={address.neighborhood}
              onChange={handleInputChange}
              required
            />
            <input 
              className="h-12 rounded-xl pl-3 md:col-span-2 border border-gray-400 focus:ring-2 focus:ring-blue-500" 
              type="text" 
              placeholder="Cidade" 
              name="city"
              value={address.city}
              onChange={handleInputChange}
              required
            />
            <select
              className="h-12 rounded-xl pl-3 md:col-span-1 border border-gray-400 focus:ring-2 focus:ring-blue-500"
              name="state"
              value={ufs}
              onChange={(e) => setUfs(e.target.value)}
              required
            >
              <option value="">UF</option>
              {innerBrazil.map((uf) => (
                <option key={uf.sigla} value={uf.sigla}>{uf.sigla}</option>
              ))}
            </select>
          </div>

          {/* Payment Section */}
          <div className="mt-8 rounded-xl border-b-4 border-purple-300 ring-2 ring-purple-500 shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row justify-around bg-purple-100 p-4 gap-2">
              {['credit', 'debit', 'pix', 'boleto'].map((method) => (
                <button
                  key={method}
                  type="button"
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                    paymentMethod === method
                      ? 'bg-purple-500 text-white border-purple-500'
                      : 'bg-white border-purple-300 hover:bg-purple-200'
                  }`}
                  onClick={() => setPaymentMethod(method)}
                  aria-label={`Método de pagamento: ${
                    method === 'credit' ? 'Crédito' :
                    method === 'debit' ? 'Débito' :
                    method === 'pix' ? 'PIX' : 'Boleto'
                  }`}
                >
                  {method === 'credit' && <FaCreditCard className="w-5 h-5" />}
                  {method === 'debit' && <FaMoneyBillAlt className="w-5 h-5" />}
                  {method === 'pix' && <FaPix className="w-5 h-5" />}
                  {method === 'boleto' && <FaBarcode className="w-5 h-5" />}
                  {method === 'credit' && 'Crédito'}
                  {method === 'debit' && 'Débito'}
                  {method === 'pix' && 'PIX'}
                  {method === 'boleto' && 'Boleto'}
                  {paymentMethod === method && <FaCheck className="ml-1" />}
                </button>
              ))}
            </div>

            {/* Installment Options */}
            {paymentMethod === 'credit' && (
              <div className="bg-white p-4 border-t border-purple-200">
                <h3 className="text-lg font-bold mb-2">Parcelamento</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {installmentOptions.map((option) => (
                    <button
                      key={option.installments}
                      type="button"
                      className={`p-2 border rounded-lg text-center ${
                        selectedInstallment === option.installments
                          ? 'bg-purple-100 border-purple-500'
                          : 'border-gray-300 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedInstallment(option.installments)}
                      aria-label={`${option.installments}x de ${formatCurrency(option.value)}`}
                    >
                      <div className="font-medium">{option.installments}x</div>
                      <div className="text-sm">{formatCurrency(option.value)}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-purple-50 px-6 py-4">
              <h3 className="text-xl font-bold mb-3">Resumo do Pedido</h3>
              <div className="max-h-60 overflow-y-auto mb-4">
                {cartItems.map(item => (
                  <div key={item.isbn?.[0] || item.title} className="flex justify-between items-center py-2 border-b border-gray-200">
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-600">Qtd: {item.quantity || 1}</p>
                    </div>
                    <p className="font-medium">
                      {formatCurrency((item.price || 0) * (item.quantity || 1))}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-300 my-2"></div>
              <div className="flex justify-between text-lg font-medium mb-2">
                <p>Subtotal:</p>
                <p>{formatCurrency(subtotal)}</p>
              </div>
              <div className="flex justify-between text-lg font-medium mb-2">
                <p>Frete:</p>
                <p>{formatCurrency(shipping)}</p>
              </div>
              {paymentMethod === 'credit' && selectedInstallment > 1 && (
                <div className="flex justify-between text-lg font-medium mb-2">
                  <p>Juros ({(selectedInstallment - 1) * 5}%):</p>
                  <p>
                    {formatCurrency(installmentOptions[selectedInstallment - 1].totalWithFee - total)}
                  </p>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold mt-3 pt-2 border-t border-gray-300">
                <p>Total:</p>
                <p>
                  {paymentMethod === 'credit' 
                    ? formatCurrency(installmentOptions[selectedInstallment - 1].totalWithFee)
                    : formatCurrency(total)}
                </p>
              </div>
              {paymentMethod === 'credit' && selectedInstallment > 1 && (
                <div className="text-center mt-2 text-purple-700 font-medium">
                  {selectedInstallment}x de {formatCurrency(installmentOptions[selectedInstallment - 1].value)}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!paymentMethod || !address.cep}
              className={`w-full py-4 text-white text-xl font-semibold transition-colors ${
                !paymentMethod || !address.cep
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
              aria-disabled={!paymentMethod || !address.cep}
            >
              Finalizar compra
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Purchase