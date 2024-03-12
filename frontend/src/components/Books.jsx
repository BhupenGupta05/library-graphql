import { useState } from "react"
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
        <h2>books</h2>
  
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {filteredBooks.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Filter 
      allGenres={allGenres}
      selectedGenres={selectedGenres}
      onGenreToggle={handleGenreToggle}/>

      </div>
    )
  }
  
  export default Books