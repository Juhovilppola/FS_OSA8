import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { useQuery, useApolloClient } from '@apollo/client'
import { ALL_AUTHORS } from './queries'
import LoginForm from './components/LoginForm'
import FavoriteGenre from './components/FavoriteGenre'

const App = () => {
  const [page, setPage] = useState('authors')
  const result = useQuery(ALL_AUTHORS)
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  //const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setToken(localStorage.getItem('phonenumbers-user-token'))

  }, [])
  if (result.loading) {
    return <div>loading...</div>
  }
  console.log(result)

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('books')
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

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />
      <LoginForm show={page === 'login'} setToken={setToken} setPage={setPage} />
      <FavoriteGenre show={page === 'recommend'} />
    </div>
  )
}

export default App
