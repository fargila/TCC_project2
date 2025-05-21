import { NextResponse } from 'next/server'

export async function GET() {
  const res = await fetch('https://openlibrary.org/search.json?q=subject:fiction&limit=100&fields=title,author_name,cover_i,isbn,first_publish_year')
  const data = await res.json()
  
  const books = data.docs
    .filter((book: any) => book.isbn?.[0])
    .map((book: any) => ({
      ...book,
      price: parseFloat(((Math.random() * (250 - 30)) + 30).toFixed(2))
    }))
  
  return NextResponse.json(books)
}