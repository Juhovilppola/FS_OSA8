import { ALL_BOOKS, BOOKS_BY_GENRES } from "../queries"
import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'

const Books = (props) => {

  let books = props.books
  const [genre, setGenre] = useState(null)


  const { data, refetch } = useQuery(BOOKS_BY_GENRES, {
    variables: { genre },
    skip: !genre,
    enabled: false,
  })


  console.log(genre)
  console.log(data)
  console.log('books.js')

  if (!props.show) {
    return null
  }


  if (data) {
    books = data.allBooks
  } else {
    books = props.books
  }


  console.log(books)
  let genres = props.books.map((book) => {
    return book.genres.filter((genre) => genre !== null)

  })

  let genreArray = []
  for (let i = 0; i < genres.length; i++) {
    for (let j = 0; j < genres[i].length; j++) {
      if (!genreArray.includes(genres[i][j])) {
        genreArray.push(genres[i][j])
      }
    }
  }

  console.log(genre)


  const handleClick = (genre) => {
    setGenre(genre)
    if (genre) {
      refetch()
    }

  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genreArray.map(genre => (

          <button key={genre} onClick={() => handleClick(genre)}>{genre}</button>

        ))}
        <button onClick={() => handleClick(null)}>All genres</button>
      </div>
    </div>
  )
}

export default Books
