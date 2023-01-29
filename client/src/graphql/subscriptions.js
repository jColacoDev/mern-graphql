import { gql } from "apollo-boost"
import { USER_INFO, POST_DATA } from "./fragments"

export const POST_CREATED = gql`
    subscription{
        postCreated {
            ${POST_DATA}
        }
    }
`
export const POST_UPDATED = gql`
    subscription{
        postUpdated {
            ${POST_DATA}
        }
    }
`
export const POST_DELETED = gql`
    subscription{
        postDeleted {
            ${POST_DATA}
        }
    }
`