import { useQuery } from "@apollo/client"
import { USER } from "../queries"

const Books = ({books}) => { 

  const userResult = useQuery(USER)
  console.log(userResult)

  if(userResult.loading) {
    return (
      <div>loading...</div>
    )
  }
  const filteredBooks = books.filter(book => book.genres.includes(userResult.data.me.favouriteGenre))
  
    return (
      <div>
        <h2>recommendations</h2>
        <p>books in your favourite genre: <strong>{userResult.data.me.favouriteGenre}</strong></p>
  
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

      </div>
    )
  }
  
  export default Books