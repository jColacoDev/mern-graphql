const {gql} = require('apollo-server-express')

const queries = `
    type Query {
        totalPosts: Int!
        allPosts: [Post!]!
    }
`
const mutations = `
    type Mutation {
        newPost(input: PostInput!): Post!
    }
`
const types = `
    type Post {
        id: ID!
        title: String!
        description: String!
    }
`
const inputs = `
    input PostInput {
        title: String! 
        description: String!
    }
`
module.exports = gql`${queries}${mutations}${types}${inputs}`;
