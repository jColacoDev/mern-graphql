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
const { makeExecutableSchema } = require('@graphql-tools/schema');

const {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageLocalDefault,
  } = require("apollo-server-core");
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const { PubSub } = require('graphql-subscriptions');

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

(async () => {
    // express app
    const app = express();
    app.use(
        cors(),
        bodyParser.json({ limit: '10mb' })
    );

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
    const pubsub = new PubSub();

    const graphqlPath = '/graphql';
    const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, './typeDefs')));
    const resolvers = mergeResolvers(loadFilesSync(path.join(__dirname, './resolvers')));
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    const apolloServer = new ApolloServer({
        schema,
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
    await apolloServer.start();
    // middlewares
    app.use(
        graphqlPath,
        expressMiddleware(apolloServer, {
            context: ({req}) => ({req, pubsub})
        }),
    );
    /***********************/
    // WebSocket server
    /***********************/
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: graphqlPath,
    });
    const serverCleanup = useServer({
            schema,
            context: async () => ({pubsub})
        }, 
        wsServer
    );

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
    app.get('/rest', authCheckMiddleware, function(req, res) {
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
        console.log('...UPLOADING ...');
        console.log(req.body);
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
    httpServer.listen(process.env.PORT, function() {
        console.log(`http server is ready at http://localhost:${process.env.PORT}`);
        console.log(`graphql server is ready at http://localhost:${process.env.PORT}${graphqlPath}`);
    });
    
})();
