// Express
const express = require('express');
// Mongo DB
const mongoose = require('mongoose');
// Apollo
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
// graphQL
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge')
const { loadFilesSync } = require('@graphql-tools/load-files')
// graphQL subscriptions
const {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageLocalDefault,
  } = require("apollo-server-core");
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');

// custom middleware
const { authCheck } = require('./helpers/auth');
const { authCheckMiddleware } = require('./helpers/auth');
//utils
require('dotenv').config();
const cloudinary = require('cloudinary')
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');

// express app
const app = express();
/*******************************************************************/
// Servers 
/*******************************************************************/
/***********************/
// http server
/***********************/
const httpServer = http.createServer(app);
/***********************/
// graphql apollo server
/***********************/
const graphqlPath = '/graphql';
const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, './typeDefs')));
const resolvers = mergeResolvers(loadFilesSync(path.join(__dirname, './resolvers')))
const apolloServer = new ApolloServer({
    typeDefs, resolvers,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
          async serverWillStart() {
            return {
              async drainServer() {
                await serverCleanup.dispose();
              },
            };
          },
        },
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      ],
});
async function startApolloServer() {
    await apolloServer.start();
    // middlewares
    app.use(
        graphqlPath,
        cors(),
        bodyParser.json({ limit: '10mb' }),
        expressMiddleware(apolloServer, {
            context: ({req, res}) => ({req, res})
        }),
    );
}
startApolloServer();
/***********************/
// WebSocket server
/***********************/
const wsServer = new WebSocketServer({
    server: httpServer,
    path: graphqlPath,
});
const serverCleanup = useServer({ typeDefs, resolvers }, wsServer);

/*******************************************************************/
// START Database
/*******************************************************************/
const startMongoDb = async () => {
    try{
        mongoose.set("strictQuery", false);
        const success = await mongoose.connect(process.env.DATABASE, {})
        console.log('DB Connected')
    } catch (error){
        console.log('DB connection error',error)
    }
};
startMongoDb();

/*******************************************************************/
// Cloudinary Config
/*******************************************************************/
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

/*******************************************************************/
// REST endpoints
/*******************************************************************/
/***********************/
// GET endpoints
/***********************/
app.get('/rest', authCheck, function(req, res) {
    res.json({
        data: 'you hit rest endpoint great!'
    });
});
/***********************/
// POST endpoints
/***********************/
app.post('/removeimage', authCheckMiddleware, function(req, res) {
    let image_id = req.body.public_id;

    cloudinary.uploader.destroy(image_id, (error, result) => {
        if(error) return res.json({success: false, error});
        res.send('ok');
    });
});
app.post('/uploadimages', authCheckMiddleware, function(req, res) {
    console.log('...UPLOADING ...')
    console.log(req.body)
    cloudinary.uploader.upload(req.body.image, result => {
        res.send({
            url: result.secure_url,
            public_id: result.public_id,
        })
    },{
        public_id: `${Date.now()}`,
        resource_type: 'auto' 
    });
});


/*******************************************************************/
// App listen
/*******************************************************************/
app.listen(process.env.PORT, function() {
    console.log(`http server is ready at http://localhost:${process.env.PORT}`);
    console.log(`graphql server is ready at http://localhost:${process.env.PORT}${graphqlPath}`);
});
