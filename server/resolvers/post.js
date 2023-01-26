const {DateTimeResolver} = require('graphql-scalars')
const {authCheck} = require('../helpers/auth')
const Post = require('../models/post')
const User = require('../models/user')

// queries
const allPosts = async (parent, args, {req}) => {
    return await Post.find({}).populate('postedBy', 'username _id').exec();
}
const postsByUser = async (parent, args, {req}) => {
    const currentUser = await authCheck(req);
    const currentUserFromDb = await User.findOne({
        email: currentUser.email
    }).exec();

    
    return await Post.find({
        postedBy: currentUserFromDb
    })
    .populate('postedBy', '_id username')
    .sort({createdAt: -1})
}


// mutation
const postCreate = async (parent, args, {req}) => {
    const currentUser = await authCheck(req);
    if(args.input.content.trim() === '') throw new Error('Content is required');

    const currentUserFromDb = await User.findOne({
        email: currentUser.email
    });

    let newPost = await new Post({
        ...args.input,
        postedBy: currentUserFromDb._id
    }).save()
    .then(post => post.populate('postedBy', '_id username'))
    
    return newPost;
}

module.exports = {
    Query: {
        allPosts,
        postsByUser
    },
    Mutation: {
        postCreate
    }
};
