const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const { PubSub } = require('graphql-subscriptions')
const author = require('./models/author')
const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    me: (root, args, context) => {
      //console.log(context.currentUser)
      return context.currentUser
    },
    allBooks: async (root, args) => {
      //console.log(Book.find({}))

      //console.log(args)
      if (!args.author && !args.genre) {
        console.log('no args')
        return await Book.find({}).populate('author')

      }

      if (!args.genre) {
        //return books.filter((book) => book.author === args.author)
        const findauthor = await Author.findOne({ name: args.author })
        if (!findauthor) {
          return null
        }
        return Book.find({ author: findauthor._id }).populate('author')
      }
      if (!args.author) {
        console.log('genre')
        const books = await Book.find({}).populate('author')
        return books.filter((book) => {
          const value = book.genres.filter((genre) => genre === args.genre)
          if (value[0] === args.genre) {
            return book

          }
        })
      }
      const findauthor = await Author.findOne({ name: args.author })
      if (!findauthor) {
        return null
      }
      const authorsBooks = await Book.find({ author: findauthor._id }).populate('author')
      //console.log(authorsBooks)
      console.log('genre and author')
      return authorsBooks.filter((book) => {
        console.log(book)
        const value = book.genres.filter((genre) => genre === args.genre)
        if (value[0] === args.genre) {
          return book
        }
      })
    },
    allAuthors: async () => {
      console.log('all authors')
      const authors = await Author.find({})


      return authors

    }

  },
  /*Author: {
    bookCount: async (root) => {
      let id = null
      const author = await Author.findOne({ name: root.name })
      if (author !== null) {
        id = author._id
      } else {
        return 0
      }
      const bookCount = await Book.find({ author: id })
      console.log('book count')
      author.bookCount = bookCount.length
      await author.save()
      return bookCount.length
    }
  },*/

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      let author = await Author.findOne({ name: args.author })

      if (!author) {
        console.log('!author')
        author = new Author({ name: args.author, bookCount: 0 })
        /*try {
          await author.save()
        } catch (error) {
          throw new GraphQLError('Saving book failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }*/
      }
      try {
        author.bookCount = author.bookCount + 1
        console.log(author.bookCount)
        console.log(author)
        await author.save()

      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })
      }

      console.log("ON author")
      console.log(author)
      const book = new Book({ ...args, author: author })
      //console.log(book)
      try {
        await book.save()


      } catch (error) {
        console.log(error)
        throw new GraphQLError('Saving book failed', {

          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })
      }


      pubsub.publish('BOOK_ADDED', { bookAdded: book })
      return book
    },
    editAuthor: async (root, args, context) => {
      console.log('edit author')
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
      console.log('edit author')
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }
      author.born = args.setBornTo
      return author.save()
      /*const updatedAuthor = { ...author, born: args.setBornTo }
      authors = authors.map(p => p.name === args.name ? updatedAuthor : p)
      return updatedAuthor*/
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },

  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    },
  },

}

module.exports = resolvers