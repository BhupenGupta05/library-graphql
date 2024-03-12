import { gql } from '@apollo/client'

const EDIT_AUTHOR = gql`
    mutation ($name: String!, $setBornTo: Int!) {
        editAuthor(
            name: $name,
            setBornTo: $setBornTo,
        ) {
            name
            born
        }
    }`

export default EDIT_AUTHOR