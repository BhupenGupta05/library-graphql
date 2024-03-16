import { useQuery } from "@apollo/client"
import USER from '../graphql/queries/userDetails'
import { Table, TableCell, TableHead, TableRow, Typography } from "@mui/material"

const Books = ({books}) => { 

  const userResult = useQuery(USER)

  if(userResult.loading) {
    return (
      <div>loading...</div>
    )
  }
  const filteredBooks = books.filter(book => book.genres.includes(userResult.data.me.favouriteGenre))

    return (
      <div>
        <Typography variant="h4" sx={{ m:2}}>recommendations</Typography>
        <Typography variant="body1" sx={{ m:2}}>books in your favourite genre: <strong>{userResult.data.me.favouriteGenre}</strong></Typography>
  
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>author</TableCell>
              <TableCell>published</TableCell>
            </TableRow>
            {filteredBooks.map((a) => (
              <TableRow key={a.title}>
                <TableCell>{a.title}</TableCell>
                <TableCell>{a.author.name}</TableCell>
                <TableCell>{a.published}</TableCell>
              </TableRow>
            ))}
          </TableHead>
        </Table>

      </div>
    )
  }
  
  export default Books