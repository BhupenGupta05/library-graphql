import { useState } from "react"
import EDIT_AUTHOR from '../graphql/mutations/editAuthor'
import ALL_AUTHORS from "../graphql/queries/allAuthors"
import { useMutation, useQuery } from "@apollo/client"
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'

const UpdateAuthor = () => {
  const authorsResult = useQuery(ALL_AUTHORS)
  const [name, setName] = useState("")
  const [born, setBorn] = useState("")
  const [selectedAuthor, setSelectedAuthor] = useState("")
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  const options =
    authorsResult.data && authorsResult.data.allAuthors
      ? authorsResult.data.allAuthors.map((author) => (
          <MenuItem key={author.name} value={author.name}>
            {author.name}
          </MenuItem>
        ))
      : []

  const submit = async (e) => {
    e.preventDefault()

    if (!selectedAuthor) {
      return
    }

    editAuthor({
      variables: { name: selectedAuthor, setBornTo: parseInt(born) },
    })

    setName("")
    setBorn("")
    setSelectedAuthor("")
  };

  return (
    <div>
      <Typography variant="h4" sx={{my:2, ml:2}}>Set Birthyear</Typography>
      <FormControl component='form' onSubmit={submit} sx={{ml:2}}>
          <Select
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select an author
            </MenuItem>
            {options}
          </Select>


          <TextField
          label='Year'
          variant="outlined"
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
            sx={{ marginTop: "2rem", marginRight:"2rem"}}
          />
        <Button type="submit" variant="contained" color="secondary" sx={{my:2}}>Update Author</Button>
      </FormControl>
    </div>
  );
};

export default UpdateAuthor
