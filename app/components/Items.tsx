import { useState } from 'react'
import Image from 'next/image'
import BookDetails from './BookDetails'
import { Book } from '../types/Book'

interface ItemsProps {
  books: Book[]
  onToggleCart: (book: Book) => void
  onToggleWishlist: (book: Book) => void
  wishlist?: Book[]
  isInCart: (book: Book) => boolean
  onOpenBookDetails?: (book: Book) => void
}

const Items = ({ 
  books,
  onToggleCart,
  onToggleWishlist,
  wishlist = [],
  isInCart,
  onOpenBookDetails
}: ItemsProps) => {
  const handleBookClick = (book: Book) => {
    onOpenBookDetails?.(book); 
  };
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  const getCoverUrl = (book: Book) => {
    if (book.isbn?.[0]) {
      return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg`
    }
    if (book.cover_i) {
      return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    }
    return '/placeholder-book-cover.png'
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
        {books.map((book) => {
          const coverUrl = getCoverUrl(book)
          const isBookInWishlist = wishlist.some(item => item.isbn?.[0] === book.isbn?.[0])
          
          return (
            <div
              key={book.isbn?.[0] || book.cover_i || book.title}
              className="group flex flex-col rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white"
            >
              <div 
                key={book.cover_i} 
                onClick={() => handleBookClick(book)}
                className="relative aspect-[2/3] bg-gray-100">
                <Image
                  src={coverUrl}
                  alt={`Capa de ${book.title}`}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/placeholder-book-cover.png'
                  }}
                />
              </div>
              
              <div className="p-3 flex-grow flex flex-col">
                <h3 
                  className="font-medium text-sm line-clamp-2 group-hover:text-blue-500 transition-colors"
                  title={book.title}
                >
                  {book.title}
                </h3>
                
                <p 
                  className="text-xs text-gray-500 mt-1 line-clamp-1"
                  title={book.author_name?.join(', ') || 'Autor desconhecido'}
                >
                  {book.author_name?.join(', ') || 'Autor desconhecido'}
                </p>
                
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm font-bold text-green-600">
                    {book.price?.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </span>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleWishlist(book)
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label={isBookInWishlist ? 'Remover da lista de desejos' : 'Adicionar à lista de desejos'}
                    >
                      {isBookInWishlist ? '❤️' : '🤍'}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleCart(book)
                      }}
                      className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                      aria-label={isInCart(book) ? 'Remover do carrinho' : 'Adicionar ao carrinho'}
                    >
                      {isInCart(book) ? '🗑️' : '🛒'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Book Details Modal */}
      {selectedBook && !onOpenBookDetails && (
        <BookDetails
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onToggleCart={onToggleCart}
          onToggleWishlist={onToggleWishlist}
          isInWishlist={wishlist.some(item => item.isbn?.[0] === selectedBook.isbn?.[0])}
          isInCart={isInCart(selectedBook)}
        />
      )}
    </>
  )
}

export default Items