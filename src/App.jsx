import { Route, BrowserRouter as Router, Routes, Link } from 'react-router-dom'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'
import { ALL_AUTHORS, ALL_BOOKS } from './queries'
import { useApolloClient, useQuery } from '@apollo/client'
import { useState } from 'react'

const App = () => {
  const[errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const padding = {
    padding: 5
  }

  const authorsResult = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)
  console.log(booksResult);

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
    localStorage.clear()   
    client.resetStore()  
  }

  const isLoggedIn = !!token

  return (
    <Router>
      <div>
        <Notify errorMessage={errorMessage}/>
        <Link style={padding} to="/authors">authors</Link>
        <Link style={padding} to="/books">books</Link>
        {isLoggedIn ? (
          <>
            <Link style={padding} to="/add">add book</Link>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <Link style={padding} to="/login">login</Link>
        )}
      </div>

      <Routes>
        <Route path='/' element={<Authors authors={authorsResult.data.allAuthors} isLoggedIn={isLoggedIn} />} />
        <Route path='/authors' element={<Authors authors={authorsResult.data.allAuthors}/>} />
        <Route path='/books' element={<Books books={booksResult.data.allBooks}/>} />
        <Route path='/add' element={<NewBook setError={notify}/>} />
        <Route path='/login' element={<LoginForm setToken={setToken} setError={notify}/>} />
      </Routes>
    </Router>
  )
}

export default App