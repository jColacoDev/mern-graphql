const {authCheck} = require('../helpers/auth')
const Post = require('../models/post')
const User = require('../models/user')

// queries
const search = async (parent, args, {req}) => {
    const {query} = args;

    return await Post.find({
        $text: {$search: query}
    }).populate('postedBy', 'username').exec();
}
const singlePost = async (parent, args, {req}) => {
    return await Post.findById({
        _id: args.postId
    })
    .populate('postedBy', '_id username')
    .exec();
}
const totalPosts = async (parent, args, {req}) =>
    await Post.find({}).estimatedDocumentCount().exec();

const allPosts = async (parent, args, {req}) => {
    const currentPage = args.page || 1;
    const perPage = args.perPage || 3;

    return await Post.find({})
        .skip((currentPage -1) * perPage)
        .populate('postedBy', 'username _id')
        .limit(perPage)
        .sort({createdAt: -1})
        .exec();
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


// mutations
const postUpdate = async (parent, args, {req}) => {
    const currentUser = await authCheck(req);
    if(args.input.content.trim() === '') throw new Error('Content is required');
    const currentUserFromDb = await User.findOne({
        email: currentUser.email
    }).exec();
    const postToUpdate = await Post.findById({_id: args.input._id}).exec();
    if(currentUserFromDb._id.toString() !== postToUpdate.postedBy._id.toString())
        throw new Error('Unauthorized action');

    let updatedPost = await Post.findByIdAndUpdate(args.input._id, 
        {...args.input}, 
        {new: true}
    ).exec()
    .then(post => post.populate('postedBy', '_id username'));

    return updatedPost;
}
const postDelete = async (parent, args, {req}) => {
    const currentUser = await authCheck(req);
    const currentUserFromDb = await User.findOne({
        email: currentUser.email
    }).exec();
    const postToDelete = await Post.findById({_id: args.postId}).exec();
    if(currentUserFromDb._id.toString() !== 
        postToDelete.postedBy._id.toString()
    ) throw new Error('Unauthorized action');

    let deletedPost = await Post.findByIdAndDelete({_id: args.postId}).exec();

    return deletedPost;
}
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
        totalPosts,
        allPosts,
        postsByUser,
        singlePost,
        search
    },
    Mutation: {
        postDelete,
        postCreate,
        postUpdate
    }
};
