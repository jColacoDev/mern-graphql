import { gql } from "apollo-boost"
import { USER_INFO, POST_DATA } from "./fragments"

export const PROFILE = gql`
    query {
        profile {
            ${USER_INFO}
        }
    }
`
export const GET_ALL_POSTS = gql`
  query {
    allPosts {
        ${POST_DATA}
    }
  }
`;

export const GET_ALL_USERS = gql`
  query {
    allUsers {
        ${USER_INFO}
    }
  }
`;

export const PUBLIC_PROFILE = gql`
    query publicProfile($username: String!) {
        publicProfile(username: $username) {
            ${USER_INFO}
        }
    }
`