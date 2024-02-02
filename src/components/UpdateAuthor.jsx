import { useState } from "react"
import { EDIT_AUTHOR, ALL_AUTHORS } from "../queries"
import { useMutation, useQuery } from "@apollo/client"
import Select from "react-select"

const UpdateAuthor = () => {
  const authorsResult = useQuery(ALL_AUTHORS)

    const [name, setName] = useState('')
    const [born, setBorn] = useState('')
    const [selectedAuthor, setSelectedAuthor] = useState('')
    const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
        refetchQueries: [ {query: ALL_AUTHORS} ]
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

        if(!selectedAuthor) {
          return;
        }

        editAuthor({ variables: {name: selectedAuthor.value, setBornTo: parseInt(born)} })

        setName('')
        setBorn('')
        setSelectedAuthor(null)
    }
  return (
    <div>
        <h2>set birthyear</h2>
        <form onSubmit={submit}>

        <div>
          <label>Select author: </label>
          <select
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}>
              <option value="" disabled>
                Select an author
                </option>
                {options}
          </select>
        </div>

        <div>
        <label>Born: </label>
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default UpdateAuthor