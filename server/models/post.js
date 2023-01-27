const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: 'Content is required',
        text: true
    },
    images: {
        type: Array,
        default: [
            {
                url: 'https://via.placeholder.com/200?text=Profile',
                public_id: Date.now()
            }
        ]
    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    }
}, {timestamps: true});

module.exports = mongoose.model('Post', postSchema)