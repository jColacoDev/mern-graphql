const {gql} = require('graphql-tag')

const scalars = `
    scalar DateTime
`
const queries = `
    type Query {
        profile: User!
        publicProfile(username: String!) : User!
        allUsers: [User!]
    }
`
const mutations = `
    type Mutation {
        userCreate: UserCreateResponse!
        userUpdate(input: UserUpdateInput): User!
    }
`
const types = `
    type UserCreateResponse {
        username: String!
        email: String!
    }
    type Image {
        url: String
        public_id: String
    }
    type User{
        _id: ID!,
        username: String
        name: String
        email: String
        images: [Image]
        about: String
        createdAt: DateTime
        updatedAt: DateTime
    }
`
const inputs = `
    input ImageInput{
        url: String
        public_id: String
    }
    input UserUpdateInput {
        username: String
        name: String
        email: String!
        images: [ImageInput]
        about: String
    }
`
module.exports = gql`${scalars}${queries}${mutations}${types}${inputs}`;