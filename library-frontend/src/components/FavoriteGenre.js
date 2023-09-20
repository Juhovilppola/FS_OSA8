import { ALL_BOOKS, BOOKS_BY_GENRES, USERGENRE } from "../queries"
import { useQuery } from '@apollo/client'
import { useState, useEffect } from 'react'

const FavoriteGenre = (props) => {
  const [genre, setGenre] = useState(null)
  //const result = useQuery(ALL_BOOKS)

  const user = useQuery(USERGENRE, {
    enabled: false,
  })

  useEffect(() => {
    try {
      if (user.data.me) {
        setGenre(user.data.me.favoriteGenre)
      }
    } catch (e) {
      setGenre(null)
    }
  }, [user.data])

  console.log(genre)
  const result = useQuery(BOOKS_BY_GENRES, {
    variables: { genre },
    skip: !genre,
    //pollInterval: 5000,
  })

  console.log(user)



  //const result = useQuery(ALL_BOOKS)
  if (!props.show) {
    return null
  } else {
    user.refetch()
  }

  if (!user.data || !user.data.me) {
    return (
      <div>
        you have no favorite genre set
      </div>
    )
  }
  let books = []
  if (result.data) {
    books = result.data.allBooks
  }



  //const genre = user.data.me.favoriteGenre
  //console.log(genre)
  //const books = result.data.allBooks.filter((book) => book.genres.includes(genre))




  /*console.log('genre testi')
  console.log(genres)
  console.log(genreArray)*/


  console.log('genreFilter if')
  console.log(books)
  if (books.length === 0) {
    return (
      <div>
        There is no books matching your favorite genre:  "{genre}"
      </div>

    )
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
    </div>
  )



}

export default FavoriteGenre
