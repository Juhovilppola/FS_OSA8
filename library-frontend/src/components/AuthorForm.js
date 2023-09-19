import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import Select from 'react-select';

import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const AuthorForm = ({ authors }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')


  const [updateAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })



  const submit = async (event) => {
    event.preventDefault()
    console.log(name.value)
    console.log(born)
    updateAuthor({ variables: { name: name.value, setBornTo: parseInt(born) } })


    setBorn('')
  }
  const authorNames = authors.map((author) => {
    return { value: author.name, label: author.name }
  })
  console.log(authorNames)
  return (
    <div>
      <h2>set birthyear</h2>

      <form onSubmit={submit}>
        <div className="App">
          <Select
            defaultValue={name}
            onChange={setName}
            options={authorNames}
          />
        </div>
        <div>
          born <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default AuthorForm