import { useState } from "react"
import {Table, TableHead, TableBody, TableRow, TableCell, Typography} from '@mui/material'
import Filter from "./Filter"

const Books = ({books}) => {  
  const [selectedGenres, setSelectedGenres] = useState([])

  const handleGenreToggle = (genre) => {
    setSelectedGenres((prevSelectedGenres) => {
      if (prevSelectedGenres.includes(genre)) {
        // Genre is already selected, remove it
        return prevSelectedGenres.filter(selectedGenre => selectedGenre !== genre)
      } else {
        // Genre is not selected, add it
        return [...prevSelectedGenres, genre]
      }
    })
  }

  const filteredBooks = selectedGenres.length === 0
    ? books
    : books.filter(book => selectedGenres.every(selectedGenre => book.genres.includes(selectedGenre)))

  //function to create set of genres
  const createSet = (...inputArrays) => {
    let uniqueValues = new Set()

    inputArrays.forEach((arr) => {
      arr.forEach((ele) => {
        uniqueValues.add(ele)
      })
    })

    return Array.from(uniqueValues)
  }

  const allGenres = createSet(...books.map((book) => book.genres))
  
    return (
      <div>
        <Typography variant="h4" sx={{my: 2, ml:2}}>books</Typography>

        <Filter 
      allGenres={allGenres}
      selectedGenres={selectedGenres}
      onGenreToggle={handleGenreToggle}/>
  
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Published</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooks.map((a) => (
              <TableRow key={a.title}>
                <TableCell>{a.title}</TableCell>
                <TableCell>{a.author.name}</TableCell>
                <TableCell>{a.published}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </div>
    )
  }
  
  export default Books