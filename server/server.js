const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge')
const { loadFilesSync } = require('@graphql-tools/load-files')
const { authCheck } = require('./helpers/auth');
const cors = require('cors');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary')
const { authCheckMiddleware } = require('./helpers/auth');

// express server
const app = express();
// middlewares
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

const db = async () => {
    try{
        mongoose.set("strictQuery", false);
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
      context: ({req, res}) => ({req, res})
    });
    await apolloServer.start();
    // applyMiddleware method connects ApolloServer to a specific HTTP framework ie: express
    apolloServer.applyMiddleware({ app });
  }
  startServer();

// server
const httpserver = http.createServer(app);

// rest endpoint
app.get('/rest', authCheck, function(req, res) {
    res.json({
        data: 'you hit rest endpoint great!'
    });
});

//cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

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

// port
app.listen(process.env.PORT, function() {
    console.log(`server is ready at http://localhost:${process.env.PORT}`);
    console.log(`graphql server is ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`);
});
