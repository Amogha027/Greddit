const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    gname: {
        type: String, 
        required: true
    },
    pname: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    upvotes: {
        type: [String],
        required: true
    },
    downvotes: {
        type: [String],
        required: true
    },
    comments: [{
        name: {
            type: String,
            required: true
        },
        day: {
            type: Date,
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    }],
    status: {
        type: String,
        required: true
    },
    saved: {
        type: [String]
    }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;

// { gname: 'DASS Assignment', pname: 'aaa', description: 'this is the first post', upvotes: 0, downvotes: 0, comments: [], status: 'active' }