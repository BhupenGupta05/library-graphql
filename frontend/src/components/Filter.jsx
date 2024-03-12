const Filter = ({allGenres, selectedGenres, onGenreToggle}) => {
  return (
    <div>

      {allGenres.map(genre => (
        <button key={genre} 
        style={{
            backgroundColor: selectedGenres.includes(genre) ? 'blue' : 'white', 
            color: selectedGenres.includes(genre) ? 'white' : 'black',
            border: '1px solid black', 
            margin: '4px', 
            padding: '4px 8px',
            cursor: 'pointer',
            position: 'relative',
        }} 
        onClick={() => onGenreToggle(genre)}>
            {genre}
        </button>
        
      ))}
    </div>
  )
}

export default Filter