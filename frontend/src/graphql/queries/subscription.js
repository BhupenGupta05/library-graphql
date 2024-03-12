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

const BOOK_ADDED = gql`
    subscription {
        bookAdded {
            ...bookDetails
        }
    }${BOOK_DETAILS}`

export default BOOK_ADDED