import { useMutation } from '@apollo/client'
import { useState } from 'react'
import ADD_BOOK from '../graphql/mutations/addBook'
import ALL_BOOKS from '../graphql/queries/allBooks'
import { updateCache } from '../App'
import { Button, FormControl, TextField, Typography } from '@mui/material'

const NewBook = ({setError}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [ addBook ] = useMutation(ADD_BOOK, {
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      setError(messages)
    },
    update: (cache, response) => {
      updateCache(cache, { query: ALL_BOOKS }, response.data.addBook)
    }
  })

  const submit = async (event) => {
    event.preventDefault()

    addBook({ variables: {title, published: parseInt(published), author, genres} })

    console.log('add book...')

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <Typography variant='h4' sx={{ my:2 ,ml:2 }}>Add a book</Typography>
      <FormControl onSubmit={submit} sx={{ml:2}}>
        <div>
          <Typography>title</Typography>
          <TextField
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            variant="outlined"
          />
        </div>
        <div>
          <Typography>author</Typography>
          <TextField
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            variant="outlined"
          />
        </div>
        <div>
          <Typography>published</Typography>
          <TextField
          sx={{mb:2}}
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
            variant="outlined"
          />
        </div>
        <div>
          <TextField
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
            variant="outlined"
          />
          <Button sx={{m:2}} onClick={addGenre} type="button" variant='contained'>
            add genre
          </Button>
        </div>
        <Typography variant='h5' sx={{mb:2}}>genres: {genres.join(' ')}</Typography>
        <Button type="submit" variant='contained'>create book</Button>
      </FormControl>
    </div>
  )
}

export default NewBook