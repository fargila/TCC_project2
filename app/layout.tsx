'use client'

import Head from 'next/head'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Book } from './types/Book'
import Header from './components/Header'
import Footer from './components/Footer'
import BookDetails from './components/BookDetails'
import Cart from './components/Cart'
import Wishlist from './components/WishList'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [cartItems, setCartItems] = useState<Book[]>([])
  const [wishlistItems, setWishlistItems] = useState<Book[]>([])
  const [modalContent, setModalContent] = useState<'cart' | 'wishlist' | null>(null)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])

  const handleToggleCart = (book: Book) => {
    setCartItems(prev => {
      const exists = prev.some(item => item.isbn?.[0] === book.isbn?.[0])
      return exists
        ? prev.filter(item => item.isbn?.[0] !== book.isbn?.[0])
        : [...prev, { ...book, quantity: 1 }]
    })
  }

  const handleToggleWishlist = (book: Book) => {
    setWishlistItems(prev =>
      prev.some(item => item.isbn?.[0] === book.isbn?.[0])
        ? prev.filter(item => item.isbn?.[0] !== book.isbn?.[0])
        : [...prev, book]
    )
  }

  const handleOpenBookDetails = (book: Book) => {
    setSelectedBook(book)
  }

  const handleCloseModal = () => {
    setModalContent(null)
    setSelectedBook(null)
  }

  const isInCart = (book: Book) => 
    cartItems.some(item => item.isbn?.[0] === book.isbn?.[0])

  const isInWishlist = (book: Book) =>
    wishlistItems.some(item => item.isbn?.[0] === book.isbn?.[0])

  const handlePurchaseComplete = (purchasedItems: Book[], total: number) => {
    setCartItems([])
    router.push(`/order-confirmation?order=${encodeURIComponent(
      JSON.stringify({
        id: Date.now(),
        date: new Date().toISOString(),
        items: purchasedItems,
        total
      })
    )}`)
  }

  return (
    <html lang="en">
      <Head>
        <title>Bookstore App</title>
        <meta name="description" content="Your favorite online bookstore" />
      </Head>
      <body className="min-h-screen flex flex-col">
        <div className="flex-grow">
          <Header
            cartCount={cartItems.length}
            wishlistCount={wishlistItems.length}
            setModalContent={setModalContent}
            books={books}
            setFilteredBooks={setFilteredBooks}
            
          />

          <main className="container mx-auto px-4 py-8">
            {children}
          </main>

          {selectedBook && (
            <BookDetails
              book={selectedBook}
              onClose={handleCloseModal}
              onToggleCart={handleToggleCart}
              onToggleWishlist={handleToggleWishlist}
              isInWishlist={isInWishlist(selectedBook)}
              isInCart={isInCart(selectedBook)}
            />
          )}

          {modalContent === 'cart' && (
            <Cart
              cartItems={cartItems}
              onClose={handleCloseModal}
              onUpdateCart={setCartItems}
              onPurchase={handlePurchaseComplete}
            />
          )}

          {modalContent === 'wishlist' && (
            <Wishlist
              wishlistItems={wishlistItems}
              onClose={handleCloseModal}
              onToggleCart={handleToggleCart}
              onToggleWishlist={handleToggleWishlist}
              isInCart={isInCart}
            />
          )}
        </div>

        <Footer />
        <ToastContainer 
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </body>
    </html>
  )
}