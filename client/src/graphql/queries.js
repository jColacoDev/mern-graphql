import { gql } from "apollo-boost"
import { USER_INFO } from "./fragments"

export const PROFILE = gql`
    query {
        profile {
            ${USER_INFO}
        }
    }
`