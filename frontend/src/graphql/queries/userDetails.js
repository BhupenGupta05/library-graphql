import { gql } from '@apollo/client'

const USER = gql`
    query {
        me {
            username
            favouriteGenre
        }
    }`

export default USER