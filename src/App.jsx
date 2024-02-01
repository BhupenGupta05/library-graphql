import { Route, BrowserRouter as Router, Routes, Link } from 'react-router-dom'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { ALL_AUTHORS, ALL_BOOKS } from './queries'
import { useQuery } from '@apollo/client'

const App = () => {
  const padding = {
    padding: 5
  }

  const authorsResult = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)

  if (authorsResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }

  console.log(booksResult.data);

  return (
    <Router>
      <div>
        <Link style={padding} to="/authors">authors</Link>
        <Link style={padding} to="/books">books</Link>
        <Link style={padding} to="/add">add book</Link>
      </div>

      <Routes>
        <Route path='/' element={<Authors authors={authorsResult.data.allAuthors}/>} />
        <Route path='/authors' element={<Authors authors={authorsResult.data.allAuthors}/>} />
        <Route path='/books' element={<Books books={booksResult.data.allBooks}/>} />
        <Route path='/add' element={<NewBook />} />
      </Routes>
    </Router>
  )
}

export default App