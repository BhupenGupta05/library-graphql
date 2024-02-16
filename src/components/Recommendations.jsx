const Books = ({books, user}) => {  
  if(!user) {
    return (
      <div>loading...</div>
    )
  }
  const filteredBooks = books.filter(book => book.genres.includes(user.favouriteGenre))
  
    return (
      <div>
        <h2>recommendations</h2>
        <p>books in your favourite genre: <strong>{user.favouriteGenre}</strong></p>
  
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