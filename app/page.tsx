'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Book } from './types/Book'
import Items from './components/Items'
import { FaArrowLeft, FaArrowRight, FaCaretUp } from 'react-icons/fa'

const ITEMS_PER_PAGE = 20

export default function CatalogPage() {
  const [currentBooks, setCurrentBooks] = useState<Book[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedSideCategories, setSelectedSideCategories] = useState<string[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/books')
        const data = await response.json()
        setBooks(data)
      } catch (error) {
        console.error("Error fetching books:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [])

  useEffect(() => {
    setTotalPages(Math.ceil(books.length / ITEMS_PER_PAGE))
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    setCurrentBooks(books.slice(startIndex, startIndex + ITEMS_PER_PAGE))
  }, [currentPage, books])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const toggleSideCategory = (category: string) => {
    if (category === 'Tudo') {
      setSelectedSideCategories([])
    } else {
      setSelectedSideCategories(prev =>
        prev.includes(category)
          ? prev.filter(c => c !== category)
          : [...prev.filter(c => c !== 'Tudo'), category]
      )
    }
  }

  const sideCategories = [
    'Tudo', 'Infantil', 'Ficção científica', 'Fantasia', 'Mistério', 'Romance', 
    'Terror', 'Crime', 'HQs', 'Arte', 'Fotografia', 'Jurídico', 'História', 
    'Psicologia', 'Economia', 'Maternidade', 'Poesía', 'Sexo', 'Viagem', 
    'Esporte', 'Política'
  ]

  const gridCategories = [
    'Programação', 'Culinária', 'Educação', 'Ficção', 'Saúde', 
    'Matemática', 'Medicina', 'Referência', 'Ciência'
  ]

  return (
    <div className="h-auto flex justify-center flex-col my-40">
      <div className="h-auto flex w-full">
        {/* Side Categories */}
        <div className="flex justify-between flex-col border border-gray-300 bg-gray-50 w-full lg:w-56 flex-shrink-0 rounded-lg shadow-md mb-4 lg:mb-0 lg:mr-6">
          <div className="flex w-full flex-col">
            <h1 className="text-2xl font-bold p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
              Categorias
            </h1>
            <div className="p-2 space-y-1">
              {sideCategories.map((category) => {
                const isSelected = selectedSideCategories.includes(category) || 
                                 (category === 'Tudo' && selectedSideCategories.length === 0)
                return (
                  <button
                    key={category}
                    onClick={() => toggleSideCategory(category)}
                    className={`w-full text-left px-4 py-2 rounded-md transition-all duration-200 ${
                      isSelected 
                        ? 'bg-blue-100 text-blue-800 font-semibold border-l-4 border-blue-600'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                )
              })}
            </div>
          </div>
          
          <div className="w-full p-2">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-full flex justify-center items-center py-3 bg-gray-100 hover:bg-gray-200 rounded-b-lg transition-colors text-gray-700"
            >
              <FaCaretUp className="mr-2" />
              Voltar ao topo
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 border border-gray-300 rounded-lg shadow-md overflow-hidden">
          {/* Grid Categories */}
          <div className="w-full bg-gray-50 p-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-1">
            {gridCategories.map((category) => {
              const isSelected = selectedSideCategories.includes(category)
              return (
                <button
                  key={category}
                  onClick={() => toggleSideCategory(category)}
                  className={`px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                    isSelected
                      ? 'bg-blue-600 text-white font-medium shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>

          {/* Book List */}
          {loading ? (
            <div className="text-center py-10">Loading books...</div>
          ) : (
            <Items
              books={currentBooks}
              onToggleCart={() => {}}
              onToggleWishlist={() => {}}
              wishlist={[]}
              isInCart={() => false}
              onOpenBookDetails={setSelectedBook}
            />
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-10 mb-8">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
              >
                <FaArrowLeft />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = currentPage <= 3
                  ? i + 1
                  : currentPage >= totalPages - 2
                    ? totalPages - 4 + i
                    : currentPage - 2 + i

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded border ${
                      currentPage === pageNum ? 'bg-blue-500 text-white' : 'border-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}

              {totalPages > 5 && (
                <>
                  <span className="px-1">...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className={`px-3 py-1 rounded border ${
                      currentPage === totalPages ? 'bg-blue-500 text-white' : 'border-gray-300'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}