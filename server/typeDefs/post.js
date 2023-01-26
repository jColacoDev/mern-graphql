const {gql} = require('apollo-server-express')

const queries = `
    type Query {
        allPosts: [Post!]!
        postsByUser: [Post!]!
    }
`
const mutations = `
    type Mutation {
        postCreate(input: PostCreateInput!): Post!
    }
`
const types = `
    type Post {
        _id: ID!
        content: String
        image: Image
        postedBy: User
    }
`
const inputs = `
    input PostCreateInput {
        content: String! 
        image: ImageInput
    }
`
module.exports = gql`${queries}${mutations}${types}${inputs}`;
