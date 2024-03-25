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
import { AppBar, Toolbar } from '@mui/material'
import Button from '@mui/material/Button'
import USER from './graphql/queries/userDetails'

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
      <AppBar position='static'>
        <Toolbar>
        <Notify errorMessage={errorMessage}/>
        {isLoggedIn ? (
          <>
          <Button style={padding} LinkComponent={Link} to="/" color="inherit" variant='text'>Home</Button>
          <Button style={padding} LinkComponent={Link} to="/authors" color="inherit" variant='text'>authors</Button>
          <Button style={padding} LinkComponent={Link} to="/books" color="inherit" variant='text'>books</Button>
            <Button style={padding} LinkComponent={Link} to="/add" color="inherit" variant='text'>add book</Button>
            <Button style={padding} LinkComponent={Link} to="/recommend" color="inherit" variant='text'>recommend</Button>
            <Button variant='outlined' onClick={logout} color="inherit">  
              logout
              </Button>
          </>
        ) : (
          <>
          <Button style={padding} LinkComponent={Link} to="/" color='inherit'>logo</Button>
          <Button style={padding} LinkComponent={Link} variant='text' disabled to="/authors" color="inherit">authors</Button>
          <Button style={padding} LinkComponent={Link} variant='text' disabled to="/books" color="inherit">books</Button>
          <Button style={padding} LinkComponent={Link} to="/login" variant='text' color="inherit">login</Button>
          </>
          
        )}

        </Toolbar>
        
      </AppBar>

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