import { useState } from "react"
import { EDIT_AUTHOR, ALL_AUTHORS } from "../queries"
import { useMutation } from "@apollo/client"

const UpdateAuthor = () => {
    const [name, setName] = useState('')
    const [born, setBorn] = useState('')
    const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
        refetchQueries: [ {query: ALL_AUTHORS} ]
      })

    const submit = async (e) => {
        e.preventDefault()

        editAuthor({ variables: {name, setBornTo: parseInt(born)} })

        setName('')
        setBorn('')
    }
  return (
    <div>
        <h2>set birthyear</h2>
        <form onSubmit={submit}>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          born
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