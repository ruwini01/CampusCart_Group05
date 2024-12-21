const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    profilepic:{
        type:String,
    },
    telephone: {
        type: Number,
    },
    address: {
        type: String,
    },
    savedposts:{
        type:Array,
    },
    date:{
        type:Date,
        default:Date.now,
    }
});

const Users = mongoose.model('users', usersSchema);

module.exports = Users;