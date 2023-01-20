const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge')
const { loadFilesSync } = require('@graphql-tools/load-files')


// express server
const app = express();

const db = async () => {
    try{
        const success = await mongoose.connect(process.env.DATABASE, {})
        console.log('DB Connected')
    } catch (error){
        console.log('DB connection error',error)
    }
};
db();

// types query / mutation / subscription
const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, './typeDefs')));

// resolvers
const resolvers = mergeResolvers(loadFilesSync(path.join(__dirname, './resolvers')))

async function startServer() {
    // graphql server
    apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
    });
    await apolloServer.start();
    // applyMiddleware method connects ApolloServer to a specific HTTP framework ie: express
    apolloServer.applyMiddleware({ app });
  }
  startServer();

// server
const httpserver = http.createServer(app);

// rest endpoint
app.get('/rest', function(req, res) {
    res.json({
        data: 'you hit rest endpoint great!'
    });
});

// port
app.listen(process.env.PORT, function() {
    console.log(`server is ready at http://localhost:${process.env.PORT}`);
    console.log(`graphql server is ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`);
});
