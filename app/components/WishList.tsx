import { FaTimes, FaShoppingCart, FaCheck } from 'react-icons/fa'
import Image from 'next/image'
import { Book } from '../types/Book'

interface WishlistProps {
  wishlistItems?: Book[]
  onClose: () => void
  onToggleCart: (book: Book) => void
  onToggleWishlist: (book: Book) => void
  isInCart: (book: Book) => boolean
}

const Wishlist = ({
  wishlistItems = [], 
  onClose,
  onToggleCart,
  onToggleWishlist,
  isInCart 
}: WishlistProps) => {
  const getCoverUrl = (book: Book, size: 'S' | 'M' | 'L' = 'M') => {
    if (book.isbn?.[0]) {
      return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-${size}.jpg`
    }
    if (book.cover_i) {
      return `https://covers.openlibrary.org/b/id/${book.cover_i}-${size}.jpg`
    }
    return '/placeholder-book-cover.png'
  }

  const handleAddToCart = (book: Book) => {
    onToggleCart({
      ...book,
      coverUrl: getCoverUrl(book, 'M')
    })
  }

  const formatCurrency = (value?: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wishlist-title"
    >
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-start mb-6">
          <h2 id="wishlist-title" className="text-2xl font-bold">
            Lista de desejos
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition-colors text-2xl"
            aria-label="Fechar lista de desejos"
          >
            <FaTimes />
          </button>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Sua lista de desejos está vazia.</p>
          </div>
        ) : (
          <ul className="space-y-4 divide-y divide-gray-200">
            {wishlistItems.map((item) => {
              const bookInCart = isInCart(item)
              return (
                <li 
                  key={item.isbn?.[0] || item.cover_i || item.title} 
                  className="pt-4 first:pt-0"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="relative w-16 h-24 flex-shrink-0 rounded overflow-hidden">
                        <Image
                          src={getCoverUrl(item, 'S')}
                          alt={`Capa de ${item.title}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/placeholder-book-cover.png'
                            target.classList.add('p-4')
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 
                          className="text-lg font-semibold truncate"
                          title={item.title}
                        >
                          {item.title}
                        </h3>
                        <p 
                          className="text-sm text-gray-600 truncate"
                          title={item.author_name?.join(', ') || 'Autor Desconhecido'}
                        >
                          {item.author_name?.join(', ') || 'Autor Desconhecido'}
                        </p>
                        <p className="font-semibold text-green-600 mt-1">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={bookInCart}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center ${
                          bookInCart
                            ? 'border border-green-500 text-green-600 bg-green-50'
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                        aria-label={bookInCart ? "Livro já está no carrinho" : "Adicionar ao carrinho"}
                      >
                        {bookInCart ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaShoppingCart />
                        )}
                        <span>{bookInCart ? 'No Carrinho' : 'Adicionar'}</span>
                      </button>
                      <button
                        onClick={() => onToggleWishlist(item)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors w-full sm:w-auto justify-center"
                        aria-label="Remover da lista de desejos"
                      >
                        <FaTimes />
                        <span>Remover</span>
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Wishlist