const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postsSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    category: {
        type: String,
        enum: ['sell', 'lost', 'found', 'boarding'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Posts = mongoose.model('posts', postsSchema);

module.exports = Posts;
