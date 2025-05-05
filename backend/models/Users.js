const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const notificationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    }

});

const usersSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    regno: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
    profilepic: {
        type: String,
    },
    telephone: {
        type: Number,
    },
    address: {
        type: String,
    },
    savedposts: {
        type: Array,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    notifications: [notificationSchema]
});

const Users = mongoose.model('users', usersSchema);

module.exports = Users;