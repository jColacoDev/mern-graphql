const {ApolloServer} = require('apollo-server')
require('dotenv').config();

// types query / mutation / subscription
const typeDefs = `
    type Query {
        totalPosts: Int!
    }
`
// resolvers
const resolvers = {
    Query: {
        totalPosts: () => 42
    }
}
// graphql server
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
})

apolloServer.listen(process.env.PORT, function(){
    console.log(`sgraphql erver is ready at port ${process.env.PORT}`)
})