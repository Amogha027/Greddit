const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gredditSchema = new Schema({
    moderator: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    keywords: {
        type: [String]
    },
    followers: {
        type: [String]
    },
    blocked: {
        type: [String]
    }, 
    waiting: {
        type: [String]
    },
    posts: {
        type: Number,
        required: true
    },
    tags: {
        type: [String]
    },
    left: [{
        name: {
            type: String,
            required: true
        },
        day: {
            type: Date,
            required: true
        }
    }],
    joined: [{
        name: {
            type: String,
            required: true
        },
        day: {
            type: Date,
            required: true
        }
    }],
    visitors: [{
        day: {
            type: Date,
            required: true
        },
        num: {
            type: Number,
            required: true
        }
    }],
    rejected: [{
        name: {
            type: String,
            required: true
        },
        day: {
            type: Date,
            required: true
        }
    }]
}, { timestamps: true });

const Greddit = mongoose.model('Greddit', gredditSchema);
module.exports = Greddit;