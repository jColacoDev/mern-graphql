import { gql } from "apollo-boost"
import { USER_INFO, POST_DATA } from "./fragments"

export const SEARCH = gql`
    query search($query: String!){
        search(query: $query) {
            ${POST_DATA}
        }
    }
`
export const PROFILE = gql`
    query {
        profile {
            ${USER_INFO}
        }
    }
`
export const TOTAL_POSTS = gql`
  query {
    totalPosts
  }
`;
export const GET_ALL_POSTS = gql`
  query allPosts($page: Int, $perPage: Int) {
    allPosts(page: $page, perPage: $perPage) {
        ${POST_DATA}
    }
  }
`;
export const SINGLE_POST = gql`
  query singlePost($postId: String!) {
    singlePost(postId: $postId) {
        ${POST_DATA}
    }
  }
`;
export const POSTS_BY_USER = gql`
  query {
    postsByUser {
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