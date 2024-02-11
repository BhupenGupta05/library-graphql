const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

// let authors = [
//   {
//     name: 'Robert Martin',
//     id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//     born: 1952,
//   },
//   {
//     name: 'Martin Fowler',
//     id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//     born: 1963
//   },
//   {
//     name: 'Fyodor Dostoevsky',
//     id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//     born: 1821
//   },
//   { 
//     name: 'Joshua Kerievsky', // birthyear not known
//     id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//   },
//   { 
//     name: 'Sandi Metz', // birthyear not known
//     id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//   },
// ]

// let books = [
//   {
//     title: 'Clean Code',
//     published: 2008,
//     author: 'Robert Martin',
//     id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Agile software development',
//     published: 2002,
//     author: 'Robert Martin',
//     id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//     genres: ['agile', 'patterns', 'design']
//   },
//   {
//     title: 'Refactoring, edition 2',
//     published: 2018,
//     author: 'Martin Fowler',
//     id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Refactoring to patterns',
//     published: 2008,
//     author: 'Joshua Kerievsky',
//     id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'patterns']
//   },  
//   {
//     title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
//     published: 2012,
//     author: 'Sandi Metz',
//     id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'design']
//   },
//   {
//     title: 'Crime and punishment',
//     published: 1866,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'crime']
//   },
//   {
//     title: 'The Demon ',
//     published: 1872,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'revolution']
//   },
// ]

const typeDefs = `
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks (author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook (
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ) : Book

    editAuthor (
      name: String!
      setBornTo: Int!
    ) : Author
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      try {
        let query = {}

        if(args.author) {
          const author = await Author.findOne({ name: args.author })
          if(author) {
            query.author = author._id
          } else {
            return []
          }
        }

        if(args.genre) {
          // Check if the provided genre is in the genres array
          query.genres = { $in: [args.genre] }
        }

        const books = await Book.find(query).populate('author')
        return books
      } catch (error) {
        console.error('Error fetching all books:', error)
        return []
      }
    },
    allAuthors: async () => {
      try {
        const allAuthors = await Author.find({})
        const authorsWithBookCount = await Promise.all(
          allAuthors.map(async (author) => {
            const bookCount = await Book.countDocuments({ author: author._id })
            return { ...author.toObject(), bookCount }
          })
        )

        return authorsWithBookCount
      } catch (error) {
        console.error('Error fetching all authors:', error)
        return []
      }
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      try {      
        let author = await Author.findOne({name: args.author})

        if (!author) {
          author = new Author({ name: args.author })
          await author.save()
        } 

        const book = new Book({ ...args, author: author._id })
        await book.save()
        return book
      } catch (error) {        
        console.error('Error in addBook mutation:', error.message)

        throw new GraphQLError('Saving book failed', {          
          extensions: {            
            code: 'BAD_USER_INPUT',            
            invalidArgs: args.title,            
            error
          }        
        })      
      }
    },

    editAuthor: async (root, args) => {
      const author = await Author.findOne({name: args.name})
      author.born = parseInt(args.setBornTo)

      try {        
        await author.save()      
      } catch (error) {        
        throw new GraphQLError('Saving author failed', {          
          extensions: {            
            code: 'BAD_USER_INPUT',            
            invalidArgs: args.name,            
            error          
          }        
        })      
      }
      return author
    },
  },

  Author: {
    bookCount: async (author) => {
      const count = await Book.countDocuments({ author: author._id })
      return count
    }
  },

  Book: {
    author: async (book) => {
      const author = await Author.findById(book.author)

      if (!author) {
        throw new GraphQLError('Author not found for the book')
      }
      return author
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})