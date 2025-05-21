import { useState, useEffect } from 'react'
import { FaArrowLeft, FaPlus, FaMinus } from 'react-icons/fa'
import Image from 'next/image'
import { Book } from '../types/Book'

interface CartProps {
  cartItems: Book[]
  onClose: () => void
  onUpdateCart: (updatedCart: Book[]) => void
  onPurchase: (cartItems: Book[], total: number) => void
}

type ShippingOption = 'express' | 'standard' | 'economy' | ''

const Cart = ({ 
  cartItems = [], 
  onClose, 
  onUpdateCart, 
  onPurchase 
}: CartProps) => {
  const [localCartItems, setLocalCartItems] = useState(cartItems)
  const [shippingOption, setShippingOption] = useState<ShippingOption>('')
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponMessage, setCouponMessage] = useState('')
  const [shippingError, setShippingError] = useState('')

  useEffect(() => {
    setLocalCartItems(cartItems)
  }, [cartItems])

  const handleQuantityChange = (index: number, action: 'increase' | 'decrease') => {
    const updatedItems = [...localCartItems]
    if (action === 'increase') {
      updatedItems[index].quantity += 1
    } else if (action === 'decrease' && updatedItems[index].quantity > 1) {
      updatedItems[index].quantity -= 1
    }
    setLocalCartItems(updatedItems)
    onUpdateCart(updatedItems)
  }

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'PROMO5') {
      setDiscount(0.05)
      setCouponMessage('Cupom aplicado com sucesso! (-5%)')
    } else {
      setDiscount(0)
      setCouponMessage('Cupom inválido.')
    }
  }

  const removeItem = (index: number) => {
    const updatedItems = localCartItems.filter((_, i) => i !== index)
    setLocalCartItems(updatedItems)
    onUpdateCart(updatedItems)
  }

  const calculateSubtotal = () => {
    return localCartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0)
  }

  const getShippingCost = (): number => {
    switch(shippingOption) {
      case 'express': return 35
      case 'standard': return 15
      case 'economy': return 0
      default: return 0
    }
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const discountValue = subtotal * discount
    return subtotal - discountValue + getShippingCost()
  }

  const handlePurchase = () => {
    if (!shippingOption) {
      setShippingError('Selecione uma opção de frete')
      return
    }
    setShippingError('')
    onPurchase(localCartItems, calculateTotal())
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getCoverUrl = (book: Book) => {
    if (book.isbn?.[0]) {
      return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-S.jpg`
    }
    if (book.cover_i) {
      return `https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`
    }
    return '/placeholder-book-cover.png'
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
    >
      <div className="bg-white w-11/12 max-w-6xl flex h-5/6 rounded-lg overflow-hidden shadow-lg">
        {/* Left Side - Cart Items */}
        <div className="w-3/4 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 id="cart-title" className="text-2xl font-bold">Carrinho</h2>
              <span className="text-gray-600">{localCartItems.length} {localCartItems.length === 1 ? 'item' : 'itens'}</span>
            </div>

            {localCartItems.length === 0 ? (
              <p className="text-gray-500">Seu carrinho está vazio.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {localCartItems.map((item, index) => (
                  <li key={`${item.isbn?.[0]}-${index}`} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 w-2/3">
                        <div className="relative w-16 h-20 flex-shrink-0 rounded overflow-hidden">
                          <Image
                            src={getCoverUrl(item)}
                            alt={`Capa de ${item.title}`}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div>
                          <p className="font-semibold line-clamp-1">{item.title}</p>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {item.author_name?.join(', ') || 'Autor Desconhecido'}
                          </p>
                          <button 
                            onClick={() => removeItem(index)}
                            className="text-red-500 text-sm mt-1 hover:underline"
                            aria-label={`Remover ${item.title} do carrinho`}
                          >
                            Remover
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-1/6 justify-center">
                        <button 
                          onClick={() => handleQuantityChange(index, 'decrease')}
                          className="p-1 border rounded hover:bg-gray-100"
                          aria-label="Reduzir quantidade"
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="w-12 text-center border rounded py-1">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => handleQuantityChange(index, 'increase')}
                          className="p-1 border rounded hover:bg-gray-100"
                          aria-label="Aumentar quantidade"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>

                      <div className="text-right w-1/6">
                        <p className="text-gray-700 font-medium">
                          {formatCurrency((item.price || 0) * (item.quantity || 1))}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={onClose}
            className="inline-flex items-center text-gray-600 hover:text-black mt-6"
            aria-label="Voltar para a loja"
          >
            <FaArrowLeft className="mr-2" />
            Voltar
          </button>
        </div>

        {/* Right Side - Order Summary */}
        <div className="w-1/4 bg-gray-100 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-4">Resumo do pedido</h2>

            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>{formatCurrency(calculateSubtotal())}</span>
            </div>

            <div className="mb-4">
              <label htmlFor="shipping" className="block mb-1 text-sm">Frete</label>
              <select
                id="shipping"
                className={`w-full border rounded px-2 py-1 text-sm ${shippingError ? 'border-red-500' : ''}`}
                onChange={(e) => setShippingOption(e.target.value as ShippingOption)}
                value={shippingOption}
                aria-invalid={!!shippingError}
                aria-describedby="shipping-error"
              >
                <option value="">Selecionar...</option>
                <option value="express">Expresso (menos de 2 dias) - R$35</option>
                <option value="standard">Padrão (5 dias) - R$15</option>
                <option value="economy">Econômico (10 dias - Grátis)</option>
              </select>
              {shippingError && (
                <p id="shipping-error" className="text-red-500 text-xs mt-1">{shippingError}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="coupon" className="block mb-1 text-sm">Cupom</label>
              <input
                id="coupon"
                type="text"
                placeholder="Digite o cupom"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              />
              {couponMessage && (
                <p className={`text-sm mt-1 ${couponMessage.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
                  {couponMessage}
                </p>
              )}
              <button
                onClick={applyCoupon}
                className="mt-2 w-full bg-red-500 text-white py-1 rounded hover:bg-red-600 text-sm"
                aria-label="Aplicar cupom"
              >
                Aplicar
              </button>
            </div>

            <div className="flex justify-between border-t pt-2 mt-2 font-semibold">
              <span>Total</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
          </div>

          <button
            disabled={localCartItems.length === 0 || !shippingOption}
            onClick={handlePurchase}
            className={`py-2 px-4 mt-6 rounded text-white w-full ${
              localCartItems.length === 0 || !shippingOption
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-800 hover:bg-blue-900'
            }`}
            aria-disabled={localCartItems.length === 0 || !shippingOption}
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart