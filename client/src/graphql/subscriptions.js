import { gql } from "apollo-boost"
import { USER_INFO, POST_DATA } from "./fragments"

export const POST_ADDED = gql`
    subscription{
        postAdded {
            ${POST_DATA}
        }
    }
`