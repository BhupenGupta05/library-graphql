import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            born 
            id
            bookCount
        }
    }`

export const ALL_BOOKS = gql`
    query {
        allBooks {
            author {
                name
            }
            published
            title
            id
        }
    }`

export const ADD_BOOK = gql`
    mutation ($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
        addBook(
            title: $title,
            author: $author,
            published: $published,
            genres: $genres
        ) {
            title
            author {
                name
            }
            id
            published
            genres
        }
    }`

export const EDIT_AUTHOR = gql`
    mutation ($name: String!, $setBornTo: Int!) {
        editAuthor(
            name: $name,
            setBornTo: $setBornTo,
        ) {
            name
            born
        }
    }`

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
      login(username: $username, password: $password)  {
        value
      }
    }
  `