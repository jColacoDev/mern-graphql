const {gql} = require('apollo-server-express')
const {posts} = require('../temp');
const {authCheck} = require('../helpers/auth')
const {DateTimeResolver} = require('graphql-scalars')

const totalPosts = () => posts.length;
const allPosts = async (parent, args, { req }) => {
    await authCheck(req);
    return posts;
} 

// mutation
const newPost = (parent, args, context) => {
    console.log(args)
    const {title, description} = args.input;
    const post = {
        id: posts.length+1,
        title,
        description
    }
    posts.push(post);

    return post;
}

module.exports = {
    Query: {
        totalPosts,
        allPosts
    },
    Mutation: {
        newPost
    }
};
