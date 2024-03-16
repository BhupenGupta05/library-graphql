import { useState } from "react"
import EDIT_AUTHOR from '../graphql/mutations/editAuthor'
import ALL_AUTHORS from "../graphql/queries/allAuthors"
import { useMutation, useQuery } from "@apollo/client"
import { Button, FormControl, Input, TextField, Typography } from '@mui/material'

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
          <option key={author.name} value={author.name}>
            {author.name}
          </option>
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
      <FormControl onSubmit={submit} sx={{ml:2}}>
        <div>
          <label>Select author: </label>
          <select
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
          >
            <option value="" disabled>
              Select an author
            </option>
            {options}
          </select>
        </div>

        <div>
          <label>Born: </label>
          <TextField
          label='Year'
          variant="outlined"
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <Button type="submit" variant="contained" color="secondary" sx={{my:2}}>Update Author</Button>
      </FormControl>
    </div>
  );
};

export default UpdateAuthor
