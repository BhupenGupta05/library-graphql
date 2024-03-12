import { Route, Routes, Link, useNavigate } from 'react-router-dom'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import ALL_AUTHORS from '../src/graphql/queries/allAuthors'
import ALL_BOOKS from '../src/graphql/queries/allBooks'
import BOOK_ADDED from '../src/graphql/queries/subscription'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import { useEffect, useState } from 'react'

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedBook) => {  
  // helper that is used to eliminate saving same person twice  
  const uniqueById = (a) => {    
    let seen = new Set()    
    return a.filter((item) => {      
      let k = item.id      
      return seen.has(k) ? false : seen.add(k)    
    })  
  }
  
  cache.updateQuery(query, ({ allBooks }) => {    
    return {      
      allBooks: uniqueById(allBooks.concat(addedBook)),    
    } 
  })
}

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('library-user-token') || null)
  const client = useApolloClient()
  const navigate = useNavigate()

  useEffect(() => {
    const storedToken = localStorage.getItem('library-user-token')
      if (storedToken) {
         setToken(storedToken)
      }
  },[])

  useSubscription(BOOK_ADDED, {
    onData: ({data, client}) => {
      const addedBook = data.data.bookAdded
      console.log(addedBook);
      notify(`${addedBook.title} added`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    }
  })

  const padding = {
    padding: 5
  }

  const authorsResult = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)

  if (authorsResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {    
    setToken(null)    
    localStorage.removeItem('library-user-token')   
    client.resetStore()  
    navigate('/')
  }

  const isLoggedIn = !!token

  return (
    <>
      <div>
        <Notify errorMessage={errorMessage}/>
        {isLoggedIn ? (
          <>
          <Link style={padding} to="/authors">authors</Link>
          <Link style={padding} to="/books">books</Link>
            <Link style={padding} to="/add">add book</Link>
            <Link style={padding} to="/recommend">recommend</Link>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <>
          <Link style={padding} to="/authors">authors</Link>
          <Link style={padding} to="/books">books</Link>
          <Link style={padding} to="/login">login</Link>
          </>
          
        )}
      </div>

      <Routes>
        <Route path='/' element={<Authors authors={authorsResult.data.allAuthors} isLoggedIn={isLoggedIn} />} />
        <Route path='/authors' element={<Authors authors={authorsResult.data.allAuthors} isLoggedIn={isLoggedIn}/>} />
        <Route path='/books' element={<Books books={booksResult.data.allBooks}/>} />
        <Route path='/add' element={<NewBook setError={notify}/>} />
        <Route path='/recommend' element={<Recommendations books={booksResult.data.allBooks} />} />
        <Route path='/login' element={<LoginForm setToken={setToken} setError={notify}/>} />
      </Routes>
    </>
  )
}

export default App