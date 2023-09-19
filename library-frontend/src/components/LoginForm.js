import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { BOOKS_BY_GENRES, LOGIN, USERGENRE } from '../queries'

const LoginForm = ({ show, setToken, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login, result] = useMutation(LOGIN, {
    refetchQueries: [{ query: USERGENRE }]

  })

  useEffect(() => {
    if (result.data) {
      console.log(result.data)
      const token = result.data.login.value
      setToken(token)
      console.log('token')
      console.log(token)
      setPage('authors')
      localStorage.setItem('phonenumbers-user-token', token)
    }
  }, [result.data]) // eslint-disable-line

  if (!show) {
    return null
  }


  const submit = async (event) => {
    event.preventDefault()

    login({ variables: { username, password } })
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm