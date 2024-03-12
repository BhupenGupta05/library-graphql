import { gql } from '@apollo/client'

const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            born 
            id
            bookCount
        }
    }`

export default ALL_AUTHORS