const {gql} = require('graphql-tag')

const queries = `
    type Query {
        totalPosts: Int!
        allPosts(page: Int, perPage: Int): [Post!]!
        postsByUser: [Post!]!
        singlePost(postId: String!): Post!
        search(query: String!): [Post]
    }
`
const mutations = `
    type Mutation {
        postCreate(input: PostCreateInput!): Post!
        postUpdate(input: PostUpdateInput!): Post!
        postDelete(postId: String!): Post!
    }
`
const subscriptions = `
    type Subscription {
        postCreated: Post
        postUpdated: Post
        postDeleted: Post
    }
    
`
const types = `
    type Post {
        _id: ID!
        content: String
        images: [Image]
        postedBy: User
    }
`
const inputs = `
    input PostCreateInput {
        content: String! 
        images: [ImageInput]
    }
    input PostUpdateInput {
        _id: String! 
        content: String! 
        images: [ImageInput]
    }
`
module.exports = gql`${queries}${mutations}${subscriptions}${types}${inputs}`;
