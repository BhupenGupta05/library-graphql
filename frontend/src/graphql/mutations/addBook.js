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

const ADD_BOOK = gql`
    mutation ($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
        addBook(
            title: $title,
            author: $author,
            published: $published,
            genres: $genres
        ) {
            ...bookDetails
        }
    }${BOOK_DETAILS}`

export default ADD_BOOK