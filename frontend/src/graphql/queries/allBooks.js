import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
    fragment bookDetails on Book {
        author {
            name
        }
        published
        title
        genres
        id
    }`

const ALL_BOOKS = gql`
    query {
        allBooks {
            ...bookDetails
        }
    }${BOOK_DETAILS}`

export default ALL_BOOKS