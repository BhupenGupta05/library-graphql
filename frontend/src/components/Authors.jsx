import {Table, TableHead, TableBody, TableRow, TableCell, Typography} from '@mui/material'
import UpdateAuthor from './UpdateAuthor'

const Authors = ({ authors, isLoggedIn }) => {
  return (
    <div>
      <Typography variant='h4' sx={{my:2, ml:2}}>Authors</Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Born</TableCell>
            <TableCell>Books</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {authors.map((author) => (
            <TableRow key={author.name}>
              <TableCell>{author.name}</TableCell>
              <TableCell>{author.born}</TableCell>
              <TableCell>{author.bookCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      

      {isLoggedIn && <UpdateAuthor />}
    </div>
  );
};

export default Authors
