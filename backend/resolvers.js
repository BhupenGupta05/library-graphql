const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

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
      allAuthors: async (root, args) => {
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
      },
      me: async (root, args, context) => {
        return context.currentUser
      }
    },
    Mutation: {
      addBook: async (root, args, context) => {
        try {      
          let author = await Author.findOne({name: args.author})
          const currentUser = context.currentUser
  
          if (!currentUser) {        
            throw new GraphQLError('not authenticated', {          
              extensions: {            
                code: 'BAD_USER_INPUT',          
              }        
            })      
          }
  
          if (!author) {
            author = new Author({ name: args.author })
            await author.save()
          } 
  
          const book = new Book({ ...args, author: author._id })
          await book.save()
          currentUser.store = currentUser.store.concat(book)
          await currentUser.save()
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
  
      editAuthor: async (root, args, context) => {
        const author = await Author.findOne({name: args.name})
        author.born = parseInt(args.setBornTo)
        const currentUser = context.currentUser
  
        if(!currentUser) {
          throw new GraphQLError('not authenticated', {          
            extensions: {            
              code: 'BAD_USER_INPUT',          
            }        
          })
        }
  
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
  
      createUser: async (root, args) => {
        try {
          const user = new User({ username: args.username, favouriteGenre: args.favouriteGenre })
          const savedUser = await user.save()
          return savedUser
        } catch (error) {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        }
      },
  
      login: async(root, args) => {
        const user = await User.findOne({ username: args.username })
  
        if(!user || args.password !== 'secret') {
          throw new GraphQLError('wrong credentials', {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          })
        }
  
        const userForToken = {
          username: user.username,
          id: user._id
        }
  
        return { value: jwt.sign(userForToken, process.env.JWT_SECRET)}
      },
    },
  
    Author: {
      bookCount: async (author) => {
        const count = await Book.countDocuments({ author: author.id })
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

module.exports = resolvers