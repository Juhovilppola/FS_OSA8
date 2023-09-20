import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { useQuery, useApolloClient, useSubscription } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED, USERGENRE } from './queries'
import LoginForm from './components/LoginForm'
import FavoriteGenre from './components/FavoriteGenre'

export const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving same person twice
  /*const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.name
      return seen.has(k) ? false : seen.add(k)
    })
  }*/

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: allBooks.concat(addedBook),
    }
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  console.log(client.link)
  //const [loggedIn, setLoggedIn] = useState(false)
  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`${addedBook.title} added`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    }
  })



  if (authors.loading || books.loading) {
    return <div>loading...</div>
  }
  console.log(authors)

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.clearStore()
    setPage('books')
  }


  if (!books.data || !authors.data) {
    localStorage.clear()
    return <div>wait</div>
  }


  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && <button onClick={() => setPage('recommend')}>recommend</button>}
        {token && <button onClick={() => logout()}>logout</button>}
        {!token && <button onClick={() => setPage('login')}>login</button>}
      </div>

      <Authors show={page === 'authors'} authors={authors.data.allAuthors} />

      <Books show={page === 'books'} books={books.data.allBooks} />

      <NewBook show={page === 'add'} />
      <LoginForm show={page === 'login'} setToken={setToken} setPage={setPage} />
      <FavoriteGenre show={page === 'recommend'} />
    </div>
  )
}

export default App
